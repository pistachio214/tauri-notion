// gitee 错误回传
interface GiteeErrorResponse {
    message: string
}

interface GiteeFileContentRequest {
    access_token: string
    owner: string
    repo: string
    path: string
    ref: string
}

interface GiteeFileContentLinks {
    self: string
    html: string
}

// 远端gitee文件内容
interface GiteeFileContentResponse {
    type: string
    encoding: string
    size: number
    name: string
    path: string
    content: string
    sha: string
    url: string
    html_url: string
    download_url: string
    _links: GiteeFileContentLinks
}



export type {
    GiteeFileContentRequest,
    GiteeFileContentResponse,
    GiteeErrorResponse,
}