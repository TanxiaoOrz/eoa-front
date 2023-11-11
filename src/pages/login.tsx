import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { type } from '@testing-library/user-event/dist/type';
import { Button, Divider, Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import {loginPost} from '../const/http.tsx'

type LoginType = 'account';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const forgetPassword = ()=>{
  alert("请联系管理员")
}

type Tokens = {
  success:boolean
  data:any
}

const onFinish =async (values:any)=>{
  console.log(values);
  let tokens:Tokens =await loginPost("/api/v1/token",values)
  console.log(tokens.data)
}


type LoginConfig = {
  backgroundImageUrl:string
  logoUrl:string
  backgroundVideoUrl:string
  loginTitle:string
  loginSubTitle:string
  activeMainTitle:string
  activeIntroduction:string
  linkUrl:string
  linkStr:string
}

const Page = () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const { token } = theme.useToken();
  const loginConfig:LoginConfig = {
    backgroundImageUrl:"https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp",
    logoUrl:"https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    backgroundVideoUrl:"https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr",
    loginTitle:"EOA",
    loginSubTitle:"可配置的低代码办公平台",
    activeMainTitle:'项目预算特化开发版本',
    activeIntroduction:'作者相关',
    linkUrl:"http://127.0.0.1:8080/doc.html",
    linkStr:"查看"
  }
  const subButton = ()=>{
    window.open(loginConfig.linkUrl);
  }
  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <LoginFormPage
        onFinish={onFinish}
        backgroundImageUrl={loginConfig.backgroundImageUrl}
        logo={loginConfig.logoUrl}
        backgroundVideoUrl={loginConfig.backgroundVideoUrl}
        title={loginConfig.loginTitle}
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        subTitle={loginConfig.loginSubTitle}
        activityConfig={{
          style: {
            boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
            color: token.colorTextHeading,
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(4px)',
          },
          title: loginConfig.activeMainTitle,
          subTitle: loginConfig.activeIntroduction,
          action: (
            <Button
              size="large"
              onClick={subButton}
              style={{
                borderRadius: 20,
                background: token.colorBgElevated,
                color: token.colorPrimary,
                width: 120,
              }
            }
            >
              {loginConfig.linkStr}
            </Button>
          ),
        }}
        actions={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >

          </div>
        }
      >
        <Tabs
          centered
          defaultActiveKey = "1"
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
        </Tabs>
        {loginType === 'account' && (
          <>
            <ProFormText
              name="loginName"
              fieldProps={{
                size: 'large',
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
            onClick={forgetPassword}
          >
            忘记密码
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
};

const Login = () => {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  );
};

export default Login