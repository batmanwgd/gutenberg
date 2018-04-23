/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ModalContent from './modal-content';
import * as ariaHelper from './aria-helper';
import './style.scss';

// Used to count the number of open modals.
let modalCount = 0;

let parentElement;

class Modal extends Component {
	static setAppElement( node ) {
		ariaHelper.setAppElement( node );
	}

	static setParentElement( node ) {
		if ( ! parentElement ) {
			parentElement = node;
		}
	}

	componentDidMount() {
		modalCount++;

		if ( ! this.parentElement ) {
			setElements();
		}

		ariaHelper.hideApp();
		parentElement.appendChild( this.node );
	}

	componentWillUnmount() {
		modalCount--;

		if ( modalCount === 0 ) {
			ariaHelper.showApp();
		}
		parentElement.removeChild( this.node );
	}

	render() {
		const {
			overlayClassName,
			className,
			style: {
				content,
				overlay,
			},
			children,
			...otherProps
		} = this.props;

		if ( ! this.node ) {
			this.node = document.createElement( 'div' );
		}

		return createPortal(
			<div
				className={ classnames(
					'components-modal__screen-overlay',
					overlayClassName
				) }
				style={ overlay }>
				<ModalContent
					style={ content }
					className={ classnames(
						'components-modal__content',
						className
					) }
					{ ...otherProps } >
					{ children }
				</ModalContent>
			</div>,
			this.node
		);
	}
}

Modal.defaultProps = {
	className: null,
	overlayClassName: null,
	onRequestClose: noop,
	focusOnMount: true,
	shouldCloseOnEsc: true,
	shouldCloseOnClickOutside: true,
	style: {
		content: null,
		overlay: null,
	},
	/* accessibility */
	contentLabel: null,
	aria: {
		labelledby: null,
		describedby: null,
	},
};

function setElements() {
	const wpwrapEl = document.getElementById( 'wpwrap' );

	if ( wpwrapEl ) {
		Modal.setAppElement( wpwrapEl );
		Modal.setParentElement( wpwrapEl.parentNode );
	}
}

export default Modal;