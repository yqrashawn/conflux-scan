import React, { Component } from 'react';
import styled from 'styled-components';
import superagent from 'superagent';
import Pagination from '../../components/Pagination';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import { convertToValueorFee, converToGasPrice, i18n, sendRequest } from '../../utils';
import media from '../../globalStyles/media';
import ConfirmSimple from '../../components/ConfirmSimple';
import * as commonCss from '../../globalStyles/common';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const StyledTabel = styled.div`
  width: 100%;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
  `}

  .content {
    padding: 0 !important;
  }
  thead tr th {
    background: rgba(0, 0, 0, 0.05) !important;
  }
  tr th {
    padding: 16px 20px !important;
    padding-right: 0 !important;
    &:last-of-type {
      padding: 16px 0 16px 20px !important;
    }
  }

  &.right {
    margin-left: 16px;
  }
  ${commonCss.paginatorMixin}
`;

const PCell = styled.div`
  margin: 0 !important;
`;

const HeadBar = styled.div`
  width: 100%;
  font-size: 16px;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
    margin-bottom: 24px;
  `}
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  * {
    display: inline-block;
    margin: 0;
  }
  h1 {
    color: #000;
    font-size: 20px;
    margin-right: 24px;
  }
`;

const IconFace = styled.div`
  margin-right: 16px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const columns = [
  {
    key: 1,
    className: 'two wide aligned',
    dataIndex: 'hash',
    title: i18n('Hash'),
    render: (text) => <EllipsisLine isLong linkTo={`/transactionsdetail/${text}`} text={text} />,
  },
  {
    key: 2,
    className: 'two wide aligned',
    dataIndex: 'from',
    title: i18n('From'),
    render: (text) => <EllipsisLine linkTo={`/accountdetail/${text}`} text={text} />,
  },
  {
    key: 3,
    className: 'two wide aligned',
    dataIndex: 'to',
    title: i18n('To'),
    render: (text) => <EllipsisLine linkTo={`/accountdetail/${text}`} text={text} />,
  },
  {
    key: 4,
    className: 'two wide aligned',
    dataIndex: 'value',
    title: i18n('Value'),
    render: (text) => <EllipsisLine unit="CFX" text={convertToValueorFee(text)} />,
  },
  {
    key: 5,
    className: 'two wide aligned',
    dataIndex: 'gasPrice',
    title: i18n('Gas Price'),
    render: (text) => <EllipsisLine unit="Gdrip" text={converToGasPrice(text)} />,
  },
  {
    key: 6,
    className: 'three wide aligned',
    dataIndex: 'timestamp',
    title: i18n('app.pages.txns.age'),
    render: (text) => <Countdown timestamp={text * 1000} />,
  },
];

function max10k(n) {
  return Math.min(10000, n);
}

/* eslint react/destructuring-assignment: 0 */
let curPageBase = 1;
document.addEventListener('clean_state', () => {
  curPageBase = 1;
});
class List extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      TxList: [],
      TotalCount: 100,
      curPage: curPageBase,
    };
  }

  componentDidMount() {
    const { curPage } = this.state;
    this.fetchTxList({ activePage: curPage });
  }

  componentWillUnmount() {
    curPageBase = this.state.curPage;
  }

  fetchTxList({ activePage }) {
    if (activePage > 10000) {
      this.setState({
        confirmOpen: true,
      });
      return;
    }
    this.setState({ isLoading: true });

    sendRequest({
      url: '/api/transaction/list',
      query: {
        pageNum: activePage,
        pageSize: 10,
      },
    }).then((res) => {
      if (res.body.code === 0) {
        this.setState({
          TxList: res.body.result.data,
          TotalCount: res.body.result.total,
          curPage: activePage,
        });
        document.dispatchEvent(new Event('scroll-to-top'));
      }
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { TxList, TotalCount, isLoading, confirmOpen, curPage } = this.state;
    return (
      <div className="page-transaction-list">
        <Wrapper>
          <HeadBar>
            <IconFace>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconjinrijiaoyiliang" />
              </svg>
            </IconFace>
            <h1>{i18n('Transactions')}</h1>
          </HeadBar>
          <TabWrapper>
            <StyledTabel>
              <div className="ui fluid card">
                <div className="content">
                  {isLoading && <TableLoading />}
                  <DataList isMobile showHeader columns={columns} dataSource={TxList} />
                </div>
              </div>
              <div className="page-pc">
                <Pagination
                  style={{ float: 'right' }}
                  ellipsisItem={null}
                  prevItem={{
                    'aria-label': 'Previous item',
                    content: i18n('lastPage'),
                  }}
                  nextItem={{
                    'aria-label': 'Next item',
                    content: i18n('nextPage'),
                  }}
                  onPageChange={(e, data) => {
                    e.preventDefault();
                    this.fetchTxList(data);
                  }}
                  activePage={curPage}
                  totalPages={max10k(Math.ceil(TotalCount / 10))}
                />
              </div>
              <div className="page-h5">
                <Pagination
                  prevItem={{
                    'aria-label': 'Previous item',
                    content: i18n('lastPage'),
                  }}
                  nextItem={{
                    'aria-label': 'Next item',
                    content: i18n('nextPage'),
                  }}
                  boundaryRange={0}
                  activePage={curPage}
                  onPageChange={(e, data) => {
                    e.preventDefault();
                    this.fetchTxList(data);
                  }}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  siblingRange={1}
                  totalPages={max10k(Math.ceil(TotalCount / 10))}
                />
              </div>
            </StyledTabel>
          </TabWrapper>
        </Wrapper>
        <ConfirmSimple
          open={confirmOpen}
          onConfirm={() => {
            this.setState({
              confirmOpen: false,
            });
          }}
        />
      </div>
    );
  }
}
export default List;
