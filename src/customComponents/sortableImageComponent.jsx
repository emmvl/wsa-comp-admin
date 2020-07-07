import * as React from 'react';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';

export default class SortableImage extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { items: props.images };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.images !== this.state.items) {
            this.setState({ items: nextProps.images })
        }
    }

    render() {
        const { items } = this.state;
        return (
            <RLDD
                cssClasses="example-list-container flexWrap"
                layout="horizontal"
                items={items ? items : this.props.images}
                itemRenderer={this.itemRenderer}
                onChange={this.handleRLDDChange}
            />
        );
    }

    itemRenderer = (item, index) => {
        return (
            <div onClick={(e) => e.stopPropagation()} >
                <img src={item.image} width="160" height="160" style={{ margin: 10 }} onClick={(e) => e.stopPropagation()} />
            </div>
        );
    };

    handleRLDDChange = (reorderedItems) => {
        this.setState({ items: reorderedItems });
        this.props.reorderedUrls(reorderedItems)
    };

}