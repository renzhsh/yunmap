export default {
    bind(el, binding) {
        el.onmouseover = () => {
            el.classList.add(binding.value);
        };
        el.onmouseout = () => {
            el.classList.remove(binding.value);
        };
    }
}