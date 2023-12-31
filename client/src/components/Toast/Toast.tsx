import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './toast.css';

interface Props {
  toastList: Array<{ id: number, backgroundColor: string, title: string, description: string }>,
  position: string,
  autoDelete: boolean,
  autoDeleteTime: number
}

const Toast = (props: Props) => {
  const { toastList, position, autoDelete, autoDeleteTime } = props;
  const [list, setList] = useState(toastList);

  useEffect(() => {
    setList([...toastList]);
  }, [toastList]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoDelete && toastList.length && list.length) {
        deleteToast(toastList[0].id);
      }
    }, autoDeleteTime);

    return () => {
      clearInterval(interval);
    }

    // eslint-disable-next-line
  }, [toastList, autoDelete, autoDeleteTime, list]);

  const deleteToast = (id: number) => {
    const listItemIndex = list.findIndex(e => e.id === id);
    const toastListItem = toastList.findIndex(e => e.id === id);
    list.splice(listItemIndex, 1);
    toastList.splice(toastListItem, 1);
    setList([...list]);
  }

  return (
    <>
      <div className={`notification-container ${position}`}>
        {
          list.map((toast, i) =>
            <div
              key={i}
              className={`notification toast ${position}`}
              style={{ backgroundColor: toast.backgroundColor }}
            >
              <button onClick={() => deleteToast(toast.id)}>
                X
              </button>
              <div>
                <p className="notification-title">{toast.title}</p>
                <p className="notification-message">
                  {toast.description}
                </p>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
}

Toast.propTypes = {
  toastList: PropTypes.array.isRequired,
  position: PropTypes.string.isRequired,
  autoDelete: PropTypes.bool,
  autoDeleteTime: PropTypes.number
}

export default Toast;