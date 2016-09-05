import observable = require("data/observable");
import { Observable as RxObservable } from 'rx';
import { EventEmitter } from 'events';

export class HelloWorldModel extends observable.Observable {

    private _counter: number;
    private _message: string;
    private eventEmitter;

    get message(): string {
        return this._message;
    }
    set message(value: string) {
        if (this._message !== value) {
            this._message = value;
            this.notifyPropertyChange("message", value)
        }
    }

    constructor() {
        super();

        // Initialize default values.

        this.eventEmitter = new EventEmitter();
        RxObservable.fromEvent(this.eventEmitter, 'data')
          .debounce(200)
          .distinctUntilChanged()
          .subscribe(input=> this.updateCounter());

        this._counter = 42;
        this.updateMessage();
    }

    private updateMessage() {
        if (this._counter <= 0) {
            this.message = "Hoorraaay! You unlocked the NativeScript clicker achievement!";
        } else {
            this.message = this._counter + " taps left";
        }
    }


    public onTap() {
        this.eventEmitter.emit('data', this._counter);
    }

    private updateCounter() {
        this._counter--;
        this.updateMessage();
    }
}