This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Project setup : Nextjs+React-testing-library+TypeScript+Tailwind CSS
 Server side ... Django REST framework  

## 1. Nextjs Project 新規作成
### 1-1.  create-next-app
    yarn create next-app . --typescript
#### Node.js version 10.13以降が必要です。 -> ターミナル `node -v`でver確認出来ます。
### 1-2.  必要 module のインストール
    yarn add axios msw swr
### 1-3.  prettierの設定 : package.json
~~~
    "prettier": {
        "singleQuote": true,
        "semi": true
    }
~~~  

## 2. React-testing-library の導入

### 2-1.  必要 module のインストール  
    yarn add --dev jest @testing-library/react @types/jest @testing-library/jest-dom @testing-library/dom babel-jest @testing-library/user-event jest-css-modules
### 2-2.  Project folder 直下に".babelrc"ファイルを作成して下記設定を追加
    touch .babelrc
~~~
    {
        "presets": ["next/babel"]
    }
~~~
### 2-3.  package.json に jest の設定を追記
~~~
    "jest": {
        "testPathIgnorePatterns": [
            "<rootDir>/.next/",
            "<rootDir>/node_modules/"
        ],
        "moduleNameMapper": {
            "\\.(css)$": "<rootDir>/node_modules/jest-css-modules"
        }
    }
~~~
### 2-4.  package.jsonに test scriptを追記
~~~
    "scripts": {
        ...
        "test": "jest --env=jsdom --verbose"
    },
~~~

## 3. Tailwind CSS の導入
https://tailwindcss.com/docs/guides/nextjs
### 3-1. 必要moduleのインストール
    yarn add tailwindcss@latest postcss@latest autoprefixer@latest
### 3-2. tailwind.config.js, postcss.config.jsの生成
    npx tailwindcss init -p
### 3-3. tailwind.config.jsのcontent設定追加
~~~
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

~~~
### 3-4. _app.tsxで'tailwindcss/tailwind.css'をインポート
~~~
import 'tailwindcss/tailwind.css';
~~~
## 4. 動作確認
### 4-1. index.tsxの編集
~~~
const Home: React.FC = () => {
  return (
    <div className="flex justify-center items-center flex-col min-h-screen font-mono">
      Hello Nextjs
    </div>
  )
}
export default Home
~~~
#### yarn dev -> Tailwind CSSが効いているかブラウザで確認
### 4-2. `__tests__`フォルダと`Home.test.tsx`ファイルの作成
~~~
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Home from '../pages/index'

it('Should render hello text', () => {
  render(<Home />)
  expect(screen.getByText('Hello Nextjs')).toBeInTheDocument()
})
~~~
#### yarn test -> テストがPASSするか確認
~~~
 PASS  __tests__/Home.test.tsx
  ✓ Should render hello text (20 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.728 s, estimated 2 s
~~~
