import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import { Pagination, Dropdown } from 'semantic-ui-react';
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style/css';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import '../../assets/semantic-ui/semantic.css';
import { convertToValueorFee, converToGasPrice } from '../../utils';
import CopyButton from '../../components/CopyButton';
import QrcodeButton from '../../components/QrcodeButton';

const { RangePicker } = DatePicker;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeadBar = styled.div`
  width: 100%;
  font-size: 16px;
  margin-bottom: 24px;
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
  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.54);
    svg {
      color: #fff;
    }
  }
`;

const Statistic = styled.div`
  box-shadow: 0 1px 3px 0;
  background: #fff;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 34px;
  .transaction {
    width: 28%;
  }
  .miner,
  .balance {
    width: 20%;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
  }
  .seen {
    width: 36%;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
  }
  .wrap {
    /* height: 68px; */
    width: 100%;
    display: flex;
    align-items: center;
    * {
      font-size: 16px;
    }
    svg {
      width: 32px;
      height: 32px;
      opacity: 0.38;
      margin: 0 16px;
    }
  }
  .sectionWrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    section {
      width: 180px;
      p {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }
`;

const TabZone = styled.div`
  position: relative;
  width: 100%;
  button {
    outline: none;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
`;

const TabZoneWrapper = styled.div`
  box-shadow: 0 1px 3px 0;
`;

const PCell = styled.div`
  margin: 0 !important;
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CtrlPanel = styled.div`
  position: absolute;
  right: 0;
  width: 43%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const columns = [
  {
    key: 1,
    dataIndex: 'ein',
    title: 'Blocks',
    // className: 'two wide',
    render: (text, row) => (
      <IconFace>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconjinrijiaoyiliang" />
        </svg>
      </IconFace>
    ),
  },
  {
    key: 2,
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text, row) => (
      <div>
        <PCell>
          <EllipsisLine isPivot text={row.zwei} />
        </PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text, row) => (
      <div>
        <PCell>{row.drei}</PCell>
      </div>
    ),
  },
  {
    key: 4,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text) => <div className="ui label">{text}</div>,
  },
];

const minedColumns = [
  {
    key: 1,
    dataIndex: 'ein',
    title: 'Blocks',
    // className: 'two wide',
    render: (text, row) => (
      <IconFace>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconjinrijiaoyiliang" />
        </svg>
      </IconFace>
    ),
  },
  {
    key: 2,
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text, row) => (
      <div>
        <PCell>
          <EllipsisLine isPivot text={row.zwei} />
        </PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text, row) => (
      <div>
        <PCell>{row.drei}</PCell>
      </div>
    ),
  },
  {
    key: 4,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text) => <div className="ui label">{text}</div>,
  },
];

const dataSource = [
  { key: 1, ein: '80580', zwei: '0xe969a6fc05897123123', drei: 'Alichs' },
  { key: 2, ein: '80581', zwei: '0xe969a6fc05897124124', drei: 'Schwarz' },
];

class Detail extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 1,
      isLoading: false,
      accountDetail: {},
      minedBlockList: [],
      queries: {
        pageNum: 1,
        pageSize: 100,
        txnType: 'All',
      },
    };
  }

  componentDidMount() {
    const { queries } = this.state;
    const {
      match: { params },
    } = this.props;

    this.fetchAccountDetail(params.accountid, queries);
  }

  async fetchAccountDetail(accountid, queries) {
    this.setState({ isLoading: true });
    const { code, result } = (await superagent.get(`/proxy/fetchAccountDetail/${accountid}`).query(queries)).body;
    if (!code) {
      this.setState(
        {
          accountDetail: result.find((item) => Object.keys(item)[0] === `account/${accountid}`)[`account/${accountid}`],
          // TxList: result.find((item) => Object.keys(item)[0] === `block/${blockHash}/transactionList`)[`block/${blockHash}/transactionList`],
          // TxTotalCount: result.find((item) => Object.keys(item)[0] === `block/${blockHash}/transactionList`)[`total_block/${blockHash}/transactionList`],
        },
        () => this.setState({ isLoading: false, queries })
      );
    }
    return {};
  }

  async fetchMinedBlockList(accountid) {
    const { code, result } = (await superagent.get(`/proxy/fetchMinedBlockList/${accountid}?pageNum=1&pageSize=20`)).body;
    if (!code) {
      this.setState(
        {
          minedBlockList: result.find((item) => Object.keys(item)[0] === `account/${accountid}/minedBlockList`)[
            `account/${accountid}/minedBlockList`
          ],
        },
        () => this.setState({ isLoading: false })
      );
    }
    return {};
  }

  render() {
    const { accountDetail, queries, currentTab, isLoading, minedBlockList } = this.state;
    const {
      match: { params },
    } = this.props;
    return (
      <div className="page-address-detail">
        <Wrapper>
          <HeadBar>
            <h1>Conflux Account</h1>
            <p>{params.accountid || '0x413957876f8239dd9246fefabc4e7d6d86d4f9b6'}</p>
            <CopyButton style={{ marginLeft: 10 }} txtToCopy={params.accountid} toolTipId="app.pages.account.detail.tooltip" />
            <QrcodeButton titleTxt={params.accountid} qrTxt={params.accountid} tooltipId="app.pages.account.detail.qr" />
          </HeadBar>
          {isLoading && <TableLoading />}
          <Statistic>
            <div className="transaction">
              <div className="wrap">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconshiliangzhinengduixiang" />
                </svg>
                <div>
                  <h2>Transactions</h2>
                  <p>
                    Sent {accountDetail.sentTransactions} & Received {accountDetail.receivedTransactions}
                  </p>
                </div>
              </div>
            </div>
            <div className="miner">
              <div className="wrap">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconwakuang" />
                </svg>
                <div>
                  <h2>Mined Blocks</h2>
                  <p>{accountDetail.minedBlocks} block</p>
                </div>
              </div>
            </div>
            <div className="balance">
              <div className="wrap">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconEquilibrium-type" />
                </svg>
                <div>
                  <h2>Belance</h2>
                  <EllipsisLine unit="CFX" text={convertToValueorFee(accountDetail.balance)} />
                </div>
              </div>
            </div>
            <div className="seen">
              <div className="wrap">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconliulan" />
                </svg>
                <div className="sectionWrap">
                  <section>
                    <h2>First Seen</h2>
                    <p>{moment(accountDetail.firstSeen * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
                  </section>
                  <section>
                    <h2>Last Seen</h2>
                    <p>{moment(accountDetail.lastSeen * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
                  </section>
                </div>
              </div>
            </div>
          </Statistic>
          <TabZone>
            <div className="ui attached tabular menu">
              <button
                type="button"
                className={currentTab === 1 ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => this.setState({ currentTab: 1 })}
              >
                Transactions
              </button>
              <button
                type="button"
                className={currentTab === 2 ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => {
                  this.setState({ currentTab: 2 });
                  this.fetchMinedBlockList(params.accountid);
                }}
              >
                Miner Block
              </button>
              <CtrlPanel>
                <span>Screening Time</span>
                <RangePicker
                  showTime={{ format: 'HH:00' }}
                  format="YYYY-MM-DD HH:00"
                  placeholder={['Start Time', 'End Time']}
                  onChange={(value) => {
                    if (!value.length) {
                      delete queries.startTime;
                      delete queries.endTime;
                      this.fetchAccountDetail(params.accountid, queries);
                    }
                  }}
                  onOk={(value) => {
                    if (value.length) {
                      const startTime = value[0].unix();
                      const endTime = value[1].unix();
                      this.fetchAccountDetail(params.accountid, { ...queries, startTime, endTime });
                    }
                  }}
                />
                <Dropdown
                  direction="left"
                  icon={
                    <IconFace style={{ borderRadius: '4px' }}>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#iconmore1" />
                      </svg>
                    </IconFace>
                  }
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      text="View All"
                      value="All"
                      onClick={(e, data) => {
                        e.preventDefault();
                        this.fetchAccountDetail(params.accountid, { ...queries, txnType: data.value });
                      }}
                    />
                    <Dropdown.Item
                      text="View Outgoing Txns"
                      value="Outgoing"
                      onClick={(e, data) => {
                        e.preventDefault();
                        this.fetchAccountDetail(params.accountid, { ...queries, txnType: data.value });
                      }}
                    />
                    <Dropdown.Item
                      text="View Incoming Txns"
                      value="Incoming"
                      onClick={(e, data) => {
                        e.preventDefault();
                        this.fetchAccountDetail(params.accountid, { ...queries, txnType: data.value });
                      }}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </CtrlPanel>
            </div>
            <div className={currentTab === 1 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
              <div className="ui fluid card">
                <div className="content">
                  <DataList showHeader columns={columns} dataSource={dataSource} />
                </div>
              </div>
              <TabWrapper>
                <Pagination
                  prevItem={{
                    'aria-label': 'Previous item',
                    content: 'Previous',
                  }}
                  nextItem={{
                    'aria-label': 'Next item',
                    content: 'Next',
                  }}
                  defaultActivePage={5}
                  totalPages={10}
                />
              </TabWrapper>
            </div>
            <div className={currentTab === 2 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
              <div className="ui fluid card">
                <div className="content">
                  <DataList showHeader columns={minedColumns} dataSource={minedBlockList} />
                </div>
              </div>
            </div>
          </TabZone>
        </Wrapper>
      </div>
    );
  }
}
Detail.propTypes = {
  match: PropTypes.objectOf(PropTypes.string),
};
Detail.defaultProps = {
  match: {},
};
export default Detail;
