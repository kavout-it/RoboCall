import { useDebounceFn } from 'ahooks';
import { useEffect, useState } from 'react';

const SearchInput = (fetchList: () => any) => {
  const [keyword, setKeyword] = useState('');
  const [isComposition, setComposition] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const { run: triggerSearch } = useDebounceFn(setIsSearch, { wait: 500 });

  // Fix Race Condition
  useEffect(() => {
    if (isSearch) {
      fetchList();
    }

    return () => setIsSearch(false);
  }, [isSearch]);

  const handleChange = async (
    event:
      | React.CompositionEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.type === 'compositionstart') {
      setComposition(true);
      return;
    }

    const { value } = event.target as HTMLInputElement;
    setKeyword(value);

    if (event.type === 'compositionend') {
      setComposition(false);
    }

    // Fix 只判断 isComposition 无法触发请求
    if (!isComposition || event.type === 'compositionend') {
      // Chrome 中，change 先于 compositionend 执行
      triggerSearch(true);
    }
  };

  return (
    <input
      autoComplete="off"
      placeholder="请输入项目名称"
      maxLength={50}
      value={keyword}
      style={{ width: 240 }}
      onChange={handleChange}
      onCompositionStart={handleChange}
      onCompositionEnd={handleChange}
    />
  );
};

export default SearchInput;
