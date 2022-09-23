import {HttpLink} from "apollo-angular/http";
import {HttpHeaders} from "@angular/common/http";
import {InMemoryCache} from "@apollo/client/core";
import {environment} from "./src/environments/environment";

const uri = 'https://api.github.com/graphql';

export function createApollo(httpLink: HttpLink) {
    return {
        link: httpLink.create({
            uri,
            headers: new HttpHeaders({
                Authorization: `Bearer ${environment.githubPersonalAccessToken}`,
            }),
        }),
        cache: new InMemoryCache(),
    };
}