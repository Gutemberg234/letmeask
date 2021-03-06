import { ReactNode } from 'react';
import cx from 'classnames';

import '../styles/question.scss'

type QuestionProps = {
    content: string,
    author: {
        name: string,
        avatar: string,
    };
    children?: ReactNode;
    isAnswer?: boolean;
    isHighlighted?: boolean;
}

export function Question ({
    content, 
    author, 
    children,
    isAnswer = false,
    isHighlighted = false,
}: QuestionProps) {
    return (
        <div className={cx('question', { answered: isAnswer }, { highlited: isHighlighted })}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    );
}