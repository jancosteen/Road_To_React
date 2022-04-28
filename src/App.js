import React from "react";

const App = () => {
  //do something

  const initialStories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
      },
      {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
      },
  ]

  const getAsyncStories = () =>
    new Promise(resolve =>
      setTimeout(
        () => resolve({ data: { stories: initialStories } }),
        2000
      )
    );
  

  const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [stories, setStories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories().then(result => {
      setStories(result.data.stories);
      setIsLoading(false);
    }).catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      story => item.objectID !== story.objectID
    );

    setStories(newStories);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }; 

  const searchedStories = stories.filter(story =>
    story.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My hacker stories.</h1>
      
      <InputWithLabel
        value={searchTerm}
        onInputChange={handleSearch}
        id="search"
        isFocused
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {isError && <p>Something went wrong ...</p>}

      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory}/>  
      )}     

    </div>
  );
};

/*rest and spread operator '...object':
  if left of the '=>' then rest (i.e below: use objectID and the REST of the properties in item)
  if right of the '=>' then spread (all the properties)
*/

const List = ({ list, onRemoveItem }) =>
  list.map(item =>
    <Item
      key={item.objectID}
      item={item} 
      onRemoveItem={onRemoveItem}
      />
  );

const Item = ({ item, onRemoveItem }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
        <button type="button" onClick={()=> onRemoveItem(item)}>
          Dismiss          
      </button>
    </span>
  </div>
);

const InputWithLabel = ({
  id,
  value,
  onInputChange,
  type = 'text',
  children,
  isFocused
}) => {
  
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children} </label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
      />
    </>
  );
};  


export default App;
