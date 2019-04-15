import {Component, OnInit} from '@angular/core';
import { Store} from '@ngrx/store';
import {ActivatedRoute, NavigationEnd, Router,PRIMARY_OUTLET} from '@angular/router';
import * as fromStore from '../../store';
import {BreadCrumb} from '../../models/breadcrumb.model';
import { filter} from 'rxjs/operators';

@Component({
    selector:'breadcrumb',
    styleUrls:['breadcrumb.component.scss'],
    template:`
        <breadcrumb-display
                [breadcrumbs]="this.breadcrumbs "
        ></breadcrumb-display>
        
    `
})

export class BreadcrumbComponent implements OnInit{

    public breadcrumbs: BreadCrumb[];

    constructor(private store:Store<fromStore.ForumAppState>,private router:Router ,private route :ActivatedRoute) {}

    ngOnInit(){
        let breadcrumb: BreadCrumb = {
            label: 'Home',
            url: ''
        };

        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
            //set breadcrumbs
            let root: ActivatedRoute = this.route.root;
            this.breadcrumbs = this.getBreadcrumbs(root);
            this.breadcrumbs = [breadcrumb, ...this.breadcrumbs];

        });
    }
    private getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: BreadCrumb[] = []): BreadCrumb[] {
        const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";
        //get the child routes
        let children: ActivatedRoute[] = route.children;

        //return if there are no more children
        if (children.length === 0) {
            return breadcrumbs;
        }

        //iterate over each children
        for (let child of children) {
            //verify primary route
            if (child.outlet !== PRIMARY_OUTLET || child.snapshot.url.length==0) {
                continue;
            }

            //verify the custom data property "breadcrumb" is specified on the route
            if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
                return this.getBreadcrumbs(child, url, breadcrumbs);
            }

            //get the route's URL segment
            let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");

            //append route URL to URL
            url += `/${routeURL}`;

            //add breadcrumb
            let breadcrumb: BreadCrumb = {
                label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
                url: url
            };
            breadcrumbs.push(breadcrumb);

            //recursive
            return this.getBreadcrumbs(child, url, breadcrumbs);
        }
        return breadcrumbs;
    }


}

















