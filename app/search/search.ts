import { EventData, Observable, PropertyChangeData } from "data/observable";
import { Cache } from "ui/image-cache";
import { Page, NavigatedData } from "ui/page";

import { Observable as RxObservable } from 'rx';
import { EventEmitter } from 'events';

import { AlbumItem, api } from "../services/api";
import { AlbumItemViewModel } from "./album-items-viewmodel";


export function pageLoaded(args : EventData) {
    let page : Page = <Page>args.object;
    let cache = new Cache();
    cache.maxRequests = 4;
    let viewModel : Observable = new Observable();
    viewModel.set('text', '');
    page.bindingContext = viewModel;
    viewModel.on(Observable.propertyChangeEvent, (data : PropertyChangeData) => {
        if (data.propertyName == "text") {
            eventEmitter.emit('text', data.value);
        }
    })

    let eventEmitter = new EventEmitter();
    RxObservable.fromEvent(eventEmitter, 'text')
        .debounce(300)
        .distinctUntilChanged()
        .subscribe(text=> {
            api.getAlbums(text).then(items => {
                let itemViewModels = items.map(item => new AlbumItemViewModel(item, cache))
                viewModel.set("items", itemViewModels);
            });
        });
}
