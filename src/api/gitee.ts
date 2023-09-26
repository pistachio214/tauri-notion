import { GiteeFileContentRequest } from '../types/gitee';
import request from './../axios/request'

export const getMenuList = (data: GiteeFileContentRequest) => {
    return request({
        url: `https://gitee.com/api/v5/repos/${data.owner}/${data.repo}/contents/${data.path}`,
        method: 'GET',
        params: {
            access_token: data.access_token,
            ref: data.ref,
        },
        headers: {
            'Accept': '/',
        }
    });
}