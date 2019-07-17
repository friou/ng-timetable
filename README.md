# ng-timetable

Angular 8 typescript plugin for building nice responsive timetables. Provides a simple typescript interface to add events and locations which can be rendered to nice HTML. Works on mobile devices as well.

It is inspired by unmaintained [timetabje.js](http://timetablejs.org/) and forked from [ng-timetable](https://github.com/zulihan/ng-timetable).

It was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.1.

## Installation
Install with npm:

```
npm install github:friou/ng-timetable
```
## Usage
Add a timetable placeholder:
```html
<div #timetable class="timetable"></div>
```

Make a timetable object, optionally set the scope in hours (the visible hours in the timetable):
```javascript
@ViewChild('timetable', {static: false}) element: ElementRef;

constructor() {
    this.timetable = new Timetable();
}

ngAfterViewInit() {
    this.selector = this.element.nativeElement;
    this.addTimeTable();
    this.timetable.setScope(9, 3);
}
```
Add some locations:
```javascript     
// OR array     
this.timetable.addLocations([
    {'id': '1', 'name': 'Rotterdam'},
    {'id': '2', 'name': 'Madrid'}
]);

// OR addOne       
this.timetable.addLocation(
    {'id': '7', 'name': 'Tokyo'}
);
```
Add your events using `addEvent(name, location, startDate, endDate[, options])`:
```javascript
this.timetable.addEvent('Sightseeing', '1', new Date(2015, 7, 17, 9, 0), new Date(2015, 7, 17, 11, 30), {url: '#'});
```

In addition, you can pass options through an object (optional):
```javascript
const options = {
  url: '#', // makes the event clickable
  class: 'vip', // additional css class
  data: { // each property will be added to the data-* attributes of the DOM node for this event
    id: 4,
    ticketType: 'VIP'
  },
  onClick: function(event, timetable, clickEvent) {} // custom click handler, which is passed the event object and full timetable as context  
};
this.timetable.addEvent('Sightseeing', '1', new Date(2015, 7, 17, 9, 0), new Date(2015, 7, 17, 11, 30), options);
 ```

Last, render the thing in your previously created timetable placeholder:
```javascript
this.renderer = new Renderer(this.timetable);
this.renderer.draw(this.selector);
```
That's it!

## Browser support
Timetable.js has been designed to work with modern browsers (only). It has been tested with the latest version of the most common browsers.

## Contributing

Please use the Github issue tracker for issues/feature requests. We use Gulp for development and Mocha with Chai for unit testing. The styles are defined in SASS. Feel free to comment/contribute.
