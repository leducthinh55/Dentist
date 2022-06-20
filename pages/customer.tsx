import { Table, Input, Button, Space, Modal, Form, Select, DatePicker } from 'antd';
const { Option } = Select;
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import { server } from '../utils/server';
import moment from 'moment'
const Customers = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isAdd, setIsAdd] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [editId, setEditId] = useState([]);
    const getColumnSearchProps = (dataIndex: any) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    // ref={node => {
                    //     this.searchInput = node;
                    // }}
                    placeholder={`Tìm kiếm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Làm lại
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: any) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible: any) => {
            // if (visible) {
            //     setTimeout(() => this.searchInput.select(), 100);
            // }
        },
        render: (text: any) => {
            if (dataIndex === 'gender') {
                text = text === true ? 'Nam' : 'Nữ';
            }
            return searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text.toString()
            )
        }

    });
    function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: any) => {
        clearFilters();
        setSearchText('');
    };
    const handleOk = () => {

    }
    const handleCancel = () => {
        setIsModalVisible(false);
    }
    const handleInitEdit = (record: any) => {
        setIsAdd(false);
        setIsModalVisible(true);
        setEditId(record._id);
        record.yearOfBirth = moment(record.yearOfBirth, 'YYYY');
        form.setFieldsValue(record);
    }
    const handleDelete = async (record: any) => {
        await axios.post(`${server}/api/customer/delete`, { id: record._id });
        fetchData();
    }
    const columns: any = [
        {
            title: 'Mã KH',
            dataIndex: 'code',
            key: 'code',
            width: '10%',
            ...getColumnSearchProps('code'),
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
            sorter: (a: any, b: any) => a.name - b.name,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            ...getColumnSearchProps('gender'),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            ...getColumnSearchProps('address'),
            sorter: (a: any, b: any) => a.address - b.address,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            ...getColumnSearchProps('phoneNumber'),
            sorter: (a: any, b: any) => a.phoneNumber - b.phoneNumber,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Năm sinh',
            dataIndex: 'yearOfBirth',
            key: 'yearOfBirth',
            ...getColumnSearchProps('yearOfBirth'),
            sorter: (a: any, b: any) => a.yearOfBirth - b.yearOfBirth,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: '',
            key: 'action',
            dataIndex: 'action',
            render: (text: any, record: any, index: any) => (
                <>
                    <div style={{ margin: 'auto' }}>
                        <Button onClick={() => handleInitEdit(record)} type="primary" style={{ marginRight: '10px' }}>
                            {"Sửa"}
                        </Button>
                        <Button onClick={() => handleDelete(record)} type="ghost">
                            {"Xóa"}
                        </Button>
                    </div>
                </>
            ),
        }
    ];
    const onFinish = async (values: any) => {
        let { yearOfBirth } = values;
        values.yearOfBirth = moment(yearOfBirth).format('YYYY');
        if(!isAdd) {
            values._id = editId;
        }
        const result = await axios.post(`${server}/api/customer/${isAdd ? 'create' : 'update'}`, values);
        if (result.status === 400) {
            return;
        }
        if (!result.data.success) {

            return;
        }
        fetchData();
        setIsModalVisible(false);
    }
    const fetchData = async () => {
        const result = await axios.get(`${server}/api/customer/get`);
        console.log(result);
        if (result.status === 400) {
            return;
        }
        if (result.data.success) {
            setData(result.data.data);
            return;
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            <Button type="primary" onClick={() => { setIsModalVisible(true); setIsAdd(true) }}>Thêm mới</Button>
            <Table columns={columns} dataSource={data} size="small" />
            <Modal title={isAdd ? "Thêm mới khách hàng" : "Điều chỉnh thông tin khách hàng"} visible={isModalVisible}
                footer={[
                    <Button form="customerForm" key="submit" htmlType="submit">
                        OK
                    </Button>,
                    <Button form="customerForm" key="cancel" htmlType="button" onClick={handleCancel}>
                        Cancel
                    </Button>
                ]}>
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    id="customerForm"
                    form={form}
                >
                    <Form.Item
                        label="Mã KH: "
                        name="code"
                        rules={[{ required: true, message: 'Mã khách hàng không được để trống' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên KH: "
                        name="name"
                        rules={[{ required: true, message: 'Tên khách hàng không được để trống' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Số ĐT: "
                        name="phoneNumber"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ: "
                        name="address"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Giới tính: "
                        name="gender"
                    >
                        <Select
                            placeholder="Chọn giới tính"
                            allowClear
                        >
                            <Option value={true}>Nam</Option>
                            <Option value={false}>Nữ</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Năm sinh"
                        name="yearOfBirth"
                    >
                        <DatePicker picker="year" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Customers;