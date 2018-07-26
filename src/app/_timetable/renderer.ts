import { ITimetable } from 'src/app/tt/ITimetable';


export class Renderer {

    timetable;
    selector;
    container;


    constructor(tt) {
        if (!(this.isOfTypeITimetable(tt))) {
            throw new Error('Initialize renderer using a Timetable');
         }
         this.timetable = tt;
    }

    isOfTypeITimetable(object: any): object is ITimetable {
        return (<ITimetable>object) !== null;
    }

    draw(selector) {
        this.container = selector;
        this.checkContainerPrecondition(this.container);
        this.emptyNode(this.container);
        this.appendTimetableAside(this.container);
        this.appendTimetableSection(this.container);
        // syncscroll.reset();
    }

    emptyNode(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    checkContainerPrecondition(container) {
        if (container === null) {
            throw new Error('Timetable container not found');
        }
    }

    appendTimetableAside(container) {
        const asideNode = container.appendChild(document.createElement('aside'));
        const asideULNode = asideNode.appendChild(document.createElement('ul'));
        this.appendRowHeaders(asideULNode);
    }

    appendRowHeaders(ulNode) {
        for (let k = 0; k < this.timetable.locations.length; k++) {
            const liNode = ulNode.appendChild(document.createElement('li'));
            const spanNode = liNode.appendChild(document.createElement('span'));
            spanNode.className = 'row-heading';
            spanNode.textContent = this.timetable.locations[k];
        }
    }

    appendTimetableSection(container) {
        const sectionNode = container.appendChild(document.createElement('section'));
        const headerNode = this.appendColumnHeaders(sectionNode);
        const timeNode = sectionNode.appendChild(document.createElement('time'));
        timeNode.className = 'syncscroll';
        timeNode.setAttribute('name', 'scrollheader');
        const width = headerNode.scrollWidth + 'px';
        this.appendTimeRows(timeNode, width);
    }

    appendColumnHeaders(node) {
        const headerNode = node.appendChild(document.createElement('header'));
        headerNode.className = 'syncscroll';
        headerNode.setAttribute('name', 'scrollheader');
        const headerULNode = headerNode.appendChild(document.createElement('ul'));

        let completed = false;
        let looped = false;

        for (let hour = this.timetable.scope.hourStart; !completed;) {
            const liNode = headerULNode.appendChild(document.createElement('li'));
            const spanNode = liNode.appendChild(document.createElement('span'));
            spanNode.className = 'time-label';
            spanNode.textContent = this.timetable.prettyFormatHour(hour);

            if (hour === this.timetable.scope.hourEnd && (this.timetable.scope.hourStart !== this.timetable.scope.hourEnd || looped)) {
                completed = true;
            }
            if (++hour === 24) {
                hour = 0;
                looped = true;
            }
        }
        return headerNode;
    }

    appendTimeRows(node, width) {
        const ulNode = node.appendChild(document.createElement('ul'));
        ulNode.style.width = width;
        ulNode.className = 'room-timeline';
        for (let k = 0; k < this.timetable.locations.length; k++) {
            const liNode = ulNode.appendChild(document.createElement('li'));
            this.appendLocationEvents(this.timetable.locations[k], liNode);
        }
    }

    appendLocationEvents(location, node) {
        for (let k = 0; k < this.timetable.events.length; k++) {
            const event = this.timetable.events[k];
            if (event.location === location) {
                this.appendEvent(event, node);
            }
        }
    }

    appendEvent(event, node) {
        const hasOptions = event.options !== undefined;
        let hasURL, hasAdditionalClass, hasDataAttributes, hasClickHandler = false;

        if (hasOptions) {
            hasURL = event.options.url !== undefined;
            hasAdditionalClass = event.options.class !== undefined;
            hasDataAttributes = event.options.data !== undefined;
            hasClickHandler = event.options.onClick !== undefined;
        }

        const elementType = hasURL ? 'a' : 'span';
        const eventNode = node.appendChild(document.createElement(elementType));
        const smallNode = eventNode.appendChild(document.createElement('small'));
        eventNode.title = event.name;

        if (hasURL) {
            eventNode.href = event.options.url;
        }

        if (hasDataAttributes) {
            for (const key in event.options.data) {
                if (event.options.data.hasOwnProperty(key)) {
                    eventNode.setAttribute('data-' + key, event.options.data[key]);
                }
            }
        }

        if (hasClickHandler) {
            eventNode.addEventListener('click', function (e) {
                event.options.onClick(event, this.timetable, e);
            });
        }

        eventNode.className = hasAdditionalClass ? 'time-entry ' + event.options.class : 'time-entry';
        eventNode.style.width = this.computeEventBlockWidth(event);
        eventNode.style.left = this.computeEventBlockOffset(event);
        smallNode.textContent = event.name;
    }

    computeEventBlockWidth(event) {
        const start = event.startDate;
        const end = event.endDate;
        const durationHours = this.computeDurationInHours(start, end);
        return durationHours / this.timetable.scopeDurationHours * 100 + '%';
    }

    computeDurationInHours(start, end) {
        return (end.getTime() - start.getTime()) / 1000 / 60 / 60;
    }

    computeEventBlockOffset(event) {
        const scopeStartHours = this.timetable.scope.hourStart;
        const eventStartHours = event.startDate.getHours() + (event.startDate.getMinutes() / 60);
        const hoursBeforeEvent = this.timetable.getDurationHours(scopeStartHours, eventStartHours);
        return hoursBeforeEvent / this.timetable.scopeDurationHours * 100 + '%';
    }
}
