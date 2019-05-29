import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';

const IconFace = styled.div`
  margin-left: 16px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 16px;
    height: 16px;
  }
  &.iconface {
    display: inline-flex;
  }
  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.54);
    svg {
      color: #fff;
    }
  }
`;

class CopyButton extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      tempTip: '',
    };
    this.onClickIcon = this.onClickIcon.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseLeave() {
    this.setState({
      tempTip: '',
    });
  }

  onClickIcon() {
    const textArea = document.createElement('textarea');
    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a
    // flash, so some of these are just precautions. However in
    // Internet Explorer the element is visible whilst the popup
    // box asking the user for permission for the web page to
    // copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';

    const { txtToCopy } = this.props;
    textArea.value = txtToCopy;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.setState({
          tempTip: 'app.comp.copyButton.copySuccess',
        });
      }
    } catch (err) {
      console.log(err);
      console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
  }

  render() {
    const { toolTipId, intl } = this.props;
    const { tempTip } = this.state;
    const tooltip = intl.formatMessage({
      id: tempTip || toolTipId,
    });

    return (
      <IconFace
        data-inverted=""
        data-tooltip={tooltip}
        data-position="bottom left"
        className="iconface"
        onClick={this.onClickIcon}
        onMouseLeave={this.onMouseLeave}
      >
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconfuzhi" />
        </svg>
      </IconFace>
    );
  }
}
CopyButton.propTypes = {
  toolTipId: PropTypes.string,
  txtToCopy: PropTypes.string,
  intl: PropTypes.objectOf({
    formatMessage: PropTypes.func,
  }),
};
CopyButton.defaultProps = {
  toolTipId: '',
  txtToCopy: '',
  intl: {
    formatMessage: () => {},
  },
};
export default injectIntl(CopyButton);
