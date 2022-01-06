import React, { useState } from 'react';

function DropDown({onSelect, activeItem, items}) {
    const [dropDownVisible, setDropDownVisible] = useState(false);

    const selectItem = (event, item) => {
        event.preventDefault();
        setDropDownVisible(!dropDownVisible);
        onSelect(item);
    }

    return (<div className="dropdown ml-3">
        <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            onClick={() => setDropDownVisible(!dropDownVisible)}
            >
            {activeItem.label}
        </button>
        <div
        className={`dropdown-menu ${dropDownVisible ? 'visible' : ''}`}>
            {items && items.map((item, i) => (
                <a className={`dropdown-item ${item.value === activeItem.value ? 'active' : null}`}
                    href="#"
                    onClick={event => selectItem(event, item.value)}
                    key={i}>
                        {item.label}
                </a>
            ))}
        </div>
    </div>);
}

export default DropDown;