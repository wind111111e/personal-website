import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export function ScrollToTop() {
  const location = useLocation();
  const navType = useNavigationType();
  const scrollPositions = useRef<{ [key: string]: number }>({});

  useLayoutEffect(() => {
    // 1. 如果是 POP 操作（点击浏览器后退/前进按钮），恢复之前的滚动位置
    if (navType === "POP") {
      const savedPosition = scrollPositions.current[location.pathname];
      if (savedPosition !== undefined) {
        window.scrollTo({
          top: savedPosition,
          behavior: "auto" // 强制瞬间跳转，不要平滑滚动
        });
      }
      return;
    }

    // 2. 如果是 PUSH 操作（新页面跳转），滚到顶部
    // 同样使用 behavior: "auto" 确保瞬间到达
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }, [location.pathname, navType]);

  // 监听滚动事件，实时保存当前页面的滚动位置
  useEffect(() => {
    const handleScroll = () => {
      // 只有在非 POP 操作时（或者任何时候）都记录当前位置
      // 这里我们简单记录所有路径的最后位置
      scrollPositions.current[location.pathname] = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  return null;
}
