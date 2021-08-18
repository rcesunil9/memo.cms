import React from 'react'
import ReactDOM from 'react-dom'

// Modal Container
// Uses React 16 portals
class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    const modalRoot = document.body;
    modalRoot.classList.add('modal-open');
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    const modalRoot = document.body;
    modalRoot.classList.remove('modal-open');
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      <ModalContent {...this.props}/>,
      this.el,
    );
  }
}

// Modal Content
// Mapped on bootstrap v4 styling
const ModalContent = ({onClose, size, style, title, children, footer}) => (
  <div className="modal-open">
    <div className="modal fade show" tabIndex={-1} role="dialog" style={{display: 'block', paddingRight: '15px'}}>
      <div
          style={{position: 'fixed', backgroundColor:'#111', opacity:'.65', top:'0', left:'0', right:'0', bottom:'0'}}
          onClick={ onClose }></div>
      <div className={`modal-dialog modal-dialog-centered modal-${size || "md"}`} role="document" style={style || {}}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{ title }</h4>
            {onClose && <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={ onClose || (e => {}) }>
              <i className="icon icon-close" aria-hidden="true" />
            </button>}
          </div>
          <div className="modal-body">{ children }</div>
        </div>
      </div>
    </div>
  </div>
)

export default Modal
