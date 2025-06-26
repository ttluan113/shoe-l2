'use client';

import { useState } from 'react';
import Header from '../Components/Header';
import { Form, Input, Button, Card, Typography, Checkbox } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

import Link from 'next/link';
import { requestLogin } from '../config/request';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

function Login() {
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await requestLogin(values);
            toast.success(res.message);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            router.push('/');
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <ToastContainer />
            <header>
                <Header />
            </header>

            <main className="max-w-md mx-auto py-12 px-4">
                <Card className="shadow-lg rounded-lg border-0">
                    <div className="text-center mb-8">
                        <Title level={2} className="font-bold">
                            Đăng nhập
                        </Title>
                        <p className="text-gray-500">Đăng nhập để tiếp tục mua sắm</p>
                    </div>

                    <Form name="login" layout="vertical" onFinish={onFinish} autoComplete="off" size="large">
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' },
                            ]}
                        >
                            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Mật khẩu"
                            />
                        </Form.Item>

                        <div className="flex justify-between mb-6">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                            </Form.Item>
                            <a href="/forgot-password" className="text-blue-600 hover:text-blue-800">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="bg-blue-600 hover:bg-blue-700 w-full"
                                loading={loading}
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <div className="text-center">
                            Chưa có tài khoản?{' '}
                            <Link href="/register" className="text-blue-600 font-medium">
                                Đăng ký ngay
                            </Link>
                        </div>
                    </Form>
                </Card>
            </main>
        </div>
    );
}

export default Login;
