import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Table, TableHeaderItem, TableItem, TableModel} from "carbon-components-angular";
import {Apollo, gql} from "apollo-angular";

@Component({
    selector: 'app-repo-table',
    templateUrl: './repo-table.component.html',
    styleUrls: ['./repo-table.component.scss']
})
export class RepoTableComponent implements OnInit {
    @ViewChild('linkTemplate')
    protected linkTemplate: TemplateRef<any>;

    model = new TableModel();
    skeletonModel = Table.skeletonModel(10, 6);
    skeleton = true;
    data = [];

    constructor(private apollo: Apollo,
                private viewContainerRef: ViewContainerRef) {
        this.apollo.watchQuery({
            query: gql`
                query REPO_QUERY {
                  # Let's use carbon as our organization
                  organization(login: "carbon-design-system") {
                    # We'll grab all the repositories in one go. To load more resources
                    # continuously, see the advanced topics.
                    repositories(first: 80, orderBy: { field: UPDATED_AT, direction: DESC }) {
                      totalCount
                      nodes {
                        url
                        homepageUrl
                        issues(filterBy: { states: OPEN }) {
                          totalCount
                        }
                        stargazers {
                          totalCount
                        }
                        releases(first: 1) {
                          totalCount
                          nodes {
                            name
                          }
                        }
                        name
                        updatedAt
                        createdAt
                        description
                        id
                      }
                    }
                  }
                }
              `
        }).valueChanges.subscribe((response: any) => {
            if (response.error) {
                const errorData: Array<TableItem[]> = [];
                errorData.push([
                    new TableItem({data: 'error!'})
                ]);
                this.model.data = errorData;
            } else if (response.loading) {
                this.skeleton = true;
            } else {
                if (response && response.data) {
                    this.skeleton = false;
                    this.data = response.data.organization.repositories.nodes;
                    this.model.pageLength = 10;
                    this.model.totalDataLength = this.data.length;
                    this.selectPage(1);
                }
            }
        });
    }

    ngOnInit(): void {
        this.model.header = [
            new TableHeaderItem({data: 'Name'}),
            new TableHeaderItem({data: 'Created'}),
            new TableHeaderItem({data: 'Updated'}),
            new TableHeaderItem({data: 'Open Issues'}),
            new TableHeaderItem({data: 'Stars'}),
            new TableHeaderItem({data: 'Links'}),
        ];
    }

    selectPage(page) {
        const offset = this.model.pageLength * (page - 1);
        const pageRawData = this.data.slice(offset, offset + this.model.pageLength);
        this.model.data = this.prepareData(pageRawData);
        this.model.currentPage = page;
    }

    prepareData(data) {
        const newData: Array<TableItem[]> = [];

        for (const datum of data) {
            newData.push([
                new TableItem({data: datum.name, expandedData: datum.description}),
                new TableItem({data: new Date(datum.createdAt).toLocaleDateString()}),
                new TableItem({data: new Date(datum.updatedAt).toLocaleDateString()}),
                new TableItem({data: datum.issues.totalCount}),
                new TableItem({data: datum.stargazers.totalCount}),
                new TableItem({
                    data: {
                        github: datum.url,
                        homepage: datum.homepageUrl
                    },
                    template: this.linkTemplate
                })
            ]);
        }
        return newData;
    }

}
