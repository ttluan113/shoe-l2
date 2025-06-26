'use client';

import { useState } from 'react';
import Header from '../Components/Header';
import { Form, Input, Button, Card, Typography, Checkbox } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, HomeOutlined, PhoneOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';

import { requestRegister } from '../config/request';

const { Title } = Typography;

function Register() {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const res = await requestRegister(values);
            console.log(res);
            toast.success('Đăng ký thành công');
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <ToastContainer />
            <header>
                <Header />
            </header>

            <main className="max-w-4xl mx-auto py-12 px-4">
                <Card className="shadow-lg rounded-lg border-0">
                    <div className="text-center mb-6">
                        <Title level={2} className="font-bold">
                            Đăng ký tài khoản
                        </Title>
                        <p className="text-gray-500">Tạo tài khoản mới để mua sắm tại L2 | Shoes</p>
                    </div>

                    <Form name="register" layout="vertical" onFinish={onFinish} autoComplete="off" size="large">
                        <Form.Item
                            name="fullName"
                            label="Họ và tên"
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ tên!' },
                                { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nhập họ và tên" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' },
                            ]}
                        >
                            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Nhập email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Nhập mật khẩu"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Xác nhận mật khẩu"
                            />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input prefix={<HomeOutlined className="text-gray-400" />} placeholder="Nhập địa chỉ nhà" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' },
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined className="text-gray-400" />}
                                placeholder="Nhập số điện thoại"
                            />
                        </Form.Item>

                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value
                                            ? Promise.resolve()
                                            : Promise.reject(new Error('Bạn cần đồng ý với điều khoản dịch vụ!')),
                                },
                            ]}
                        >
                            <Checkbox>
                                Tôi đã đọc và đồng ý với <a href="#">Điều khoản dịch vụ</a> và{' '}
                                <a href="#">Chính sách bảo mật</a>
                            </Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="bg-blue-600 hover:bg-blue-700 w-full"
                                loading={loading}
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>

                        <div className="text-center">
                            Bạn đã có tài khoản?{' '}
                            <Link href="/login" className="text-blue-600 font-medium">
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </Form>
                </Card>
            </main>
        </div>
    );
}

export default Register;
