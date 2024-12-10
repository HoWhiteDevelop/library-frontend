import { FC } from "react";
import { Book } from "../types/book";
export const BookShower: FC<Book> = ({
    title,
    author,
    isbn,
    description,
    price,
    publishDate,
    status,
}) => {
    return(
        <div className="">
            <div className="">
                <img></img>
            </div>
            <p>
                书名：{title}
            </p>
            <p>
                作者：{author}
            </p>
            <p>
                简介：{description}
            </p>
            <p>
                价格：{price}
            </p>
            <p>
                出版日期：{publishDate}
            </p>
            <p>
                IBSN码：{isbn}
            </p>
            <p>
                状态：{status}
            </p>
        </div>
    );
}