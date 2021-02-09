import HttpExcepriont from './HttpException';

class PostNotFoundException extends HttpExcepriont{
    constructor(id: string){
        super(404, `Post with id ${id} not found`);
    }
}

export default PostNotFoundException;