/**
 * Created by mayaj on 2016-04-26.
 */
import * as request from 'request-promise';
import * as cheerio from 'cheerio';
import {Models} from '../models/models';

const Bookmark = Models.bookmark;

export module BookmarkService {
    /**
     * 북마크들을 가지고 온다.
     *
     * @param tags
     * @returns {Query<T[]>}
     */
    export function get(tags: string[]) {
        let query: any = {};
        if(tags) {
            query.categories = {$in: tags}
        }

        return Bookmark.find(query);
    }

    /**
     * url의 정보를 가지고 온다.
     *
     * @param url
     * @returns {any}
     */
    export async function getUrlInfo(url: string) {
        const html = await request(url);
        const $ = cheerio.load(html);
        let htmlInfo: any = {
            'og:title':null,
            'og:description':null,
            'og:image':null
        };
        const meta = $('meta');
        const keys = Object.keys(meta);
        for (let s in htmlInfo) {
            keys.forEach(function(key) {
                if ( meta[key].attribs
                    && meta[key].attribs.property
                    && meta[key].attribs.property === s) {
                    htmlInfo[s] = meta[key].attribs.content;
                }
            })
        }
        htmlInfo.title = $('title').html();

        return htmlInfo;
    }

    /**
     * 북마크 저장
     * bookmarkVO는 bookmark router에서 확인하기 바랍니다.
     *
     * @param userId
     * @param bookMarkVO
     * @returns {any|void|Query<T>}
     */
    export function save(userId: string, bookMarkVO: any) {
        let bookmark: any = new Bookmark(bookMarkVO);
        bookmark.userId = userId;
        return bookmark.save();
    }

    /**
     * 수정
     * bookmarkVO는 bookmark router에서 확인하기 바랍니다.
     *
     * @param userId
     * @param bookmarkVO
     * @returns {Query<T>}
     */
    export function put(userId: string, bookmarkVO: any) {
        return Bookmark.update({_id: bookmarkVO._id, userId: userId},{$set: bookmarkVO})
    }

    /**
     * 삭제
     *
     * @param userId
     * @param _id
     */
    export function remove(userId: string, _id: string) {
        return Bookmark.remove({_id: _id, userId: userId});
    }
}