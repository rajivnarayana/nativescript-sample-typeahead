# Introduction

This repository demonstrates the use of Observables within non angular based nativescript project.

# Mission

Set out to create a search page that talks to a remote web service to 
get results with desired search params. The search params are captured from a textfield that user types into.

We want to get the results as user types but we also want to avoid unnecessary calls to the API as long user is still typing.

# Set up

Make sure nativescript is installed and a project can be created with 
```
tns create MyAppName --tsc
```
# Throttling API requests
We can use [rx](https://www.npmjs.com/package/rx) and [events](https://www.npmjs.com/package/events) npm modules just like any other javascript code. Just add them to package.json and perform <i>npm install</i>. 

We need an event emitter that generates an event when user types a key. 
```javascript
import { EventEmitter } from 'events';

let eventEmitter = new EventEmitter();
```

With two way databinding in nativescript we just listen to the property change event on the view model instead of listening to a key press event or text change event on the text field.
```javascript
viewModel.on(Observable.propertyChangeEvent, (data : PropertyChangeData) => {
    if (data.propertyName == "text") {
        eventEmitter.emit('text', data.value);
    }
})
```

 We need Rx library to process the changes, wait for 300 milliseconds for no more text , only then make an API call to fetch new results.
```javascript
import { Observable as RxObservable } from 'rx';

RxObservable.fromEvent(eventEmitter, 'text')
    .debounce(300)
    .distinctUntilChanged()
    .subscribe(text=> {
        api.getAlbums(text).then(items => {
            let itemViewModels = items.map(item => new AlbumItemViewModel(item, cache))
            viewModel.set("items", itemViewModels);
        });
    });
```

Complete source available at [search.ts](./app/search/search.ts)

# Screen Shots
<img src="https://raw.githubusercontent.com/rajivnarayana/nativescript-sample-typeahead/master/APISearchResults.png" width="320"/>
<img src="https://raw.githubusercontent.com/rajivnarayana/nativescript-sample-typeahead/master/AndroidSearchResults.png" width="320"/>

# Promises and Observables

A [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) represents a value which may be available now, or in the future, or never.
They come out of the box and does not need any third party modules.
From [debug-utils.ts](./app/utils/debug-utils.ts)
```javascript
export function delay(milli = 3000) {
    return new Promise(resolve => setTimeout(resolve, milli)); 
}
```
and can be used as the following 
```javascript
delay(2000).then(() => {
    console.log(`This will be printed after 2 seconds`);
})
```

An observable, from [RxJS](https://xgrommx.github.io/rx-book/content/observable/index.html), is an object that sends notifications. Please refer [Introduction by Andre Saltz](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
