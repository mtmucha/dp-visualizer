import { trigger, style, transition, query, animate, animateChild, group } from '@angular/animations'
import { Optional } from '@angular/core';

export const slideRightAnimation = 
    trigger('rightAnimation',[
        transition('stock <=> bag', [
            style({position: 'relative'}),
            query(':enter, :leave',[
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                },)
            ]),
            query(":enter",[
                style({
                    left: '-100%'
                })
            ]),
            query(':leave', animateChild()),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '100%' }))
                ]),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ])
            ]),
            query(':enter', animateChild()),
        ]),
    ]);
