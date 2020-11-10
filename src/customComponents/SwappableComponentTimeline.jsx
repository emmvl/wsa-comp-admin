import { ConsoleSqlOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import "./swappable.css"
class Swappable extends Component {
  constructor() {
    super();

    this.state = {
      customFunc: null,
      isMoving: false
    };
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  mouseDown() {
    this.setState({
      isMoving: true,
    });
  }

  drag(ev, customFunc = null) {
    ev.dataTransfer.setData('src', ev.target.id);

    this.setState({
      initialParentNode: ev.target.parentNode
    });
  }

  dragEnd(ev, customFunc = null) {
    this.setState({
      isMoving: false,
    });

    if (customFunc && ev.target.parentNode != this.state.initialParentNode) {
      this.props.customFunc();
    }

    else if (this.state.isMoving) {
      this.props.onMoveEnd()
    }
  }

  drop(ev, dragableId, dropzoneId, customFunc = null, swappable = true) {
    if (swappable == false) {
      return
    }
    ev.preventDefault();

    let src = document.getElementById(ev.dataTransfer.getData('src'));
    if (src == null) {
      return
    }
    let srcParent = src.parentNode;

    let target = document.getElementById(dragableId);
    let targetParent = target.parentNode;

    // swappable
    //   ? this.swapElements(src, target, srcParent, targetParent)
    //   : this.transferElement(src, dropzoneId);

    if (swappable)
      this.swapElements(src, target, srcParent, targetParent);
  }

  swapElements(src, target, srcParent, targetParent) {
    let sourceIndexArray = src.id.split(':');
    let targetIndexArray = target.id.split(':');

    const isCurrentSwappable = this.props.isCurrentSwappable(target.id, src.id);
    console.log('isCurrentSwappable', isCurrentSwappable)

    if (sourceIndexArray[2] === targetIndexArray[2] && isCurrentSwappable) {
      target.replaceWith(src);
      srcParent.appendChild(target);
      this.props.onSwap(src.id, target.id);
    }
  }

  render() {
    const dropZoneStyle = {
      width: '50px',
      minHeight: '50px',
      //   padding: '10px',
      border: '1px solid #aaaaaa'
    };

    const draggableStyle = {
      width: '50px',
      height: '50px',
      //   padding: '10px',
      border: '1px solid red'
    };

    const { id, content, swappable, customFunc } = this.props;
    const dropzoneId = 'drop' + id;
    // const dragableId = 'drag' + id;
    const dragableId = id;
    return (
      <div
        id={dropzoneId}

        onDrop={event =>

          this.drop(event, dragableId, dropzoneId, customFunc, swappable)
        }
        onDragOver={event => this.allowDrop(event)}
        onMouseDown={() => this.mouseDown()}
        className="dropzoneId"
        style={{ width: '100%' }}
      >
        <div
          id={dragableId}
          draggable={swappable}
          onDragStart={event => this.drag(event)}
          onDragEnd={event => this.dragEnd(event, customFunc)}
          className="dragableId"
          style={{ width: '100%' }}
        >
          {this.props.children}
          {/* {this.state.isMoving && this.props.movableTooltipData && <span>{this.props.movableTooltipData}</span>} */}
        </div>
      </div>
    );
  }
}

export default Swappable;
