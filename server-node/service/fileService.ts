/**
 * Created by mayaj on 2016-04-27.
 */

import {Models} from '../models/models';

const File = Models.file;

export module FileService {
    /**
     * DB에서 삭제 예정변경 처리 해준다. 실제 삭제는 따로 스케쥴러가 돌면서 진행을한다.
     *
     * @param _id
     */
    export function remove(_itemId: string) {
        return File.update({_itemId: _itemId}, {$set: {needDelete: true}});
    }

    /**
     * 게시판 ID를 넣어준다
     *
     * @param files
     * @param _itemId
     * @returns {Query<T>}
     */
    export function addBoardId(files: any[], _itemId: string) {
        let fileIds: string[] = new Array();
        for(const file of files) {
            fileIds.push(file._id);
        }

        return File.update({_id: {$in: fileIds}}, {$set: {_itemId: _itemId}});
    }

    /**
     * 파일 업로드
     *
     * @param req
     */
    export async function save(userId: string, fileInfo: any) {
        let file: any = new File(fileInfo);
        file.userId = userId;
        return file.save();
    }
}