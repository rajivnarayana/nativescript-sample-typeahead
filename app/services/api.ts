import { HttpRequestOptions, HttpResponse, HttpContent, request as httpRequest } from "http";
import { delay } from "../utils/debug-utils";

export class AlbumItem {
    name : string;
    description : string;
    thumbURL : string;
    largeURL : string;
}

interface IAPI {
    getAlbums(searchTerm: String) : Promise<AlbumItem[]>;
}

class API implements IAPI {

    private static HOST : string = 'http://ws.audioscrobbler.com';
    private static ALBUM_ITEMS_URL = `${API.HOST}/2.0`;
    private static TIMEOUT : number = 30 * 1000; // 10 seconds.

    getAlbums(searchTerm = "a") : Promise<AlbumItem[]> {
        console.log(`searching for ${searchTerm}`);
        let url = `${API.ALBUM_ITEMS_URL}?method=album.search&album=${encodeURIComponent(searchTerm)}&api_key=63eb95272a18420f8565e7cc52328e7c&format=json&limit=100`;
        return searchTerm.trim().length ?httpRequest({
            url : url, 
            method :'GET', 
            timeout : API.TIMEOUT
        }).then((response)=>{
            let json = response.content.toJSON()
            let albums = json.results.albummatches.album.map((album) => {
                return <AlbumItem> {
                    name : album.name,
                    description : album.artist,
                    thumbURL : album.image[0]['#text'],
                    largeURL : album.image[2]['#text']
                }
            })
            return albums;
        }).catch((error)=>{
            console.log(error);
            return [];
        }) : Promise.resolve([]);
    }
}

class DummyAPI implements IAPI {

    getAlbums(searchTerm = "") : Promise<AlbumItem[]> {
        let items = new Array(50).fill(null).map(item => ({
            name : "Idly",
            description : "Rice bater cake",
            thumbURL : `https://placeholdit.imgix.net/~text?txtsize=30&txt=${Math.floor(Math.random()*8999+1000)}&w=100&h=64`
        }));
        return delay().then(()=>{
            let content : HttpContent = {
                toString : () => JSON.stringify(items),
                raw : () => "",
                toJSON : () => items,
                toImage : () => null,
                toFile : () => null
            }

            let response : HttpResponse = {
                statusCode : 200,
                content : content,
                headers : {},
            }
            return response.content.toJSON();
        })
    }
}

export var api = new API();