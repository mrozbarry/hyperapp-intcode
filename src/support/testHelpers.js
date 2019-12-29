const makeWrapper = (vNode) => {
  const children = () => vNode ? vNode.children.map(makeWrapper) : [];
  const isTag = () => vNode && vNode.type === (void 0);

  return {
    ...vNode,
    isTag,
    tag: () => isTag() && vNode.name,
    text: () => {
      if (!vNode) {
        return '';
      }
      if (vNode.type !== 3) {
        return children().map(n => n.text()).join('');
      }
      return vNode.name;
    },
    raw: () => JSON.parse(JSON.stringify(vNode)),
    children,
    childAt: (index) => vNode && makeWrapper(vNode.children[index]),
  };
};

export const examineVNode = (vNode) => makeWrapper(vNode);
