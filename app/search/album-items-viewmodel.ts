import { Observable } from "data/observable";
import { ImageSource, fromNativeSource, fromUrl } from "image-source";
import { Cache } from "ui/image-cache";
import { AlbumItem } from "../services/api";

export class AlbumItemViewModel extends Observable {

    private _name : string;
    private _description : string;
    private _thumbnailImageURL : string;
    private _largeURL : string;
    private _thumbnailImageSource : ImageSource;

    constructor(data: AlbumItem, public cache: Cache) {
        super();
        this._thumbnailImageURL = data.thumbURL;
        this._name = data.name;
        this._description = data.description;
        this._largeURL = data.largeURL;
    }

    get thumbnailImageSource() : ImageSource {
        if (!this._thumbnailImageSource) {
            let image = this.cache.get(this.thumbnailURL);
            if (image) {
                this._thumbnailImageSource = fromNativeSource(image);
            } else {
                this.cache.push({
                    url:this._thumbnailImageURL,
                    key:this._thumbnailImageURL,
                    completed: (result, key) => {
                        if (this._thumbnailImageURL === key) {                                    
                            this._thumbnailImageSource = result;
                            this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "thumbnailImageSource", value: this._thumbnailImageSource });
                        }
                    }
                })
            }
        }
        return this._thumbnailImageSource;
    }
    
    get thumbnailURL() : string {
        return this._thumbnailImageURL;
    }

    get name() : string {
        return this._name;
    }

    get description() : string {
        return this._description;
    }
    
    public toString() {
        return this.name;
    }
}
