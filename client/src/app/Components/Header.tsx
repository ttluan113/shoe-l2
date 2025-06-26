import Image from 'next/image';
import logo from '../assets/images/logo.webp';
import { Button, Input, Space } from 'antd';
import { SearchOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';

import Link from 'next/link';

function Header() {
    return (
        <div className="w-full h-16 border-b border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)] bg-white sticky top-0 z-10">
            <div className="w-[90%] h-full mx-auto flex items-center justify-between">
                <Link href="/">
                    <div className="flex items-center">
                        <Image
                            src={logo}
                            alt="logo"
                            width={50}
                            height={50}
                            className="hover:opacity-90 transition-opacity cursor-pointer"
                        />
                        <h1 className="text-2xl font-bold ml-2">L2 | Shoes</h1>
                    </div>
                </Link>

                <div className="w-[350px] h-10 relative">
                    <Input
                        size="large"
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="rounded-full border border-gray-300 hover:border-gray-400 transition-all"
                    />
                </div>

                <Space size={12}>
                    <Link href="/login">
                        <Button
                            type="primary"
                            icon={<LoginOutlined />}
                            className="bg-blue-600 hover:bg-blue-700 transition-colors flex items-center"
                            size="large"
                        >
                            Đăng nhập
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button
                            type="default"
                            icon={<UserAddOutlined />}
                            className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors flex items-center"
                            size="large"
                        >
                            Đăng ký
                        </Button>
                    </Link>
                </Space>
            </div>
        </div>
    );
}

export default Header;
