import Vue from 'vue'
import Layout from '@/page/index/'
import routes from './config'

// console.log('router config')

if (routes) {
    function changeChildren (item) {
        Vue.set(item, 'component', Layout)
        if (item.children && item.children.length > 0) {
            Vue.set(item, 'redirect', item.children && item.children.length > 0 ? `${item.children[0].path}` : `@/views/${item.path}/index`)
            item.children.map((child) => {
                if (child.children && child.children.length > 0) changeChildren(child)
                else {
                    const paths = child.path.split('/')
                    let subPath = ''
                    let lastPath = ''

                    paths.map((path, i) => {
                        if (i > 1 && i < paths.length - 1) subPath += `/${path}`
                        if (i == paths.length - 1) lastPath = path
                    })

                    const meta = { i18n: lastPath }
                    const component = () => import(/* webpackChunkName: "views" */ `@/views${child.path}`)
                    Vue.set(child, 'meta', meta)
                    Vue.set(child, 'component', component)
                }
            })
        } else {
            const subRoutes = []
            const subRoute = {
                path: 'index',
                name: item.name,
                meta: {
                    i18n: 'index'
                },
                component: () => import(/* webpackChunkName: "views" */ `@/views${item.path}/index`)
            }
            subRoutes.push(subRoute)

            Vue.set(item, 'redirect', `${item.path}/index`)
            Vue.set(item, 'children', subRoutes)
        }
    }

    routes.map((item) => {
        changeChildren(item)
    })
} else {
    routes = []
}

export default routes
