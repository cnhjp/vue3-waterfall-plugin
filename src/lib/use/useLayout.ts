/*
 * @Author: Yaowen Liu
 * @Date: 2022-03-08 15:04:02
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-23 16:37:03
 */
import type { Ref } from 'vue'
import { ref } from 'vue'
import { addClass, hasClass, prefixStyle } from '../utils/dom'
import type { WaterfallProps } from '../types/waterfall'
import type { CssStyleObject } from '../types/util'

const transform = prefixStyle('transform')
const duration = prefixStyle('animation-duration')
const delay = prefixStyle('animation-delay')
const transition = prefixStyle('transition')
const fillMode = prefixStyle('animation-fill-mode')

export function useLayout(props: WaterfallProps, colWidth: Ref<number>, cols: Ref<number>, offsetX: Ref<number>) {
  const posY = ref<number[]>([])
  const wrapperHeight = ref(0)

  // 获取对应y下标的x的值
  const getX = (index: number): number => {
    const count = props.hasAroundGutter ? index + 1 : index
    return props.gutter * count + colWidth.value * index + offsetX.value
  }

  // 初始y
  const initY = (): void => {
    posY.value = new Array(cols.value).fill(props.hasAroundGutter ? props.gutter : 0)
  }

  // 添加入场动画
  const animation = addAnimation(props)

  // 排版
  const layoutHandle = async() => {
    // 初始化y集合
    initY()

    // 获取节点
    const items = document.querySelectorAll('.waterfall-item') as NodeListOf<HTMLElement>
    if (items.length === 0) return false

    // 遍历节点
    for (let i = 0; i < items.length; i++) {
      const curItem = items[i] as HTMLElement

      // curItem.addEventListener('transitionend', handle, false)
      // function handle() {
      //   console.log('css事件过渡效果完成')
      // }

      // 最小的y值
      const minY = Math.min.apply(null, posY.value)
      // 最小y的下标
      const minYIndex = posY.value.indexOf(minY)
      // 当前下标对应的x
      const curX = getX(minYIndex)

      // 设置x,y,width
      const style = curItem.style as CssStyleObject

      // 设置偏移
      if (transform) style[transform] = `translate3d(${curX}px,${minY}px, 0)`
      style.width = `${colWidth.value}px`

      // 更新当前index的y值
      const { height } = curItem.getBoundingClientRect()
      posY.value[minYIndex] += height + props.gutter

      // 添加动画时间
      if (transition) style[transition] = '.3s'

      // 添加入场动画
      animation(curItem)
    }

    wrapperHeight.value = Math.max.apply(null, posY.value)
  }

  return {
    wrapperHeight,
    layoutHandle,
  }
}

// 动画
function addAnimation(props: WaterfallProps) {
  return (item: HTMLElement) => {
    const content = item!.firstChild as HTMLElement
    if (content && !hasClass(content, props.animationPrefix)) {
      const durationSec = `${props.animationDuration / 1000}s`
      const delaySec = `${props.animationDelay / 1000}s`
      const style = content.style as CssStyleObject
      style.visibility = 'visible'
      if (duration)
        style[duration] = durationSec

      if (delay)
        style[delay] = delaySec

      if (fillMode)
        style[fillMode] = 'both'

      addClass(content, props.animationPrefix)
      addClass(content, props.animationEffect)
    }
  }
}
