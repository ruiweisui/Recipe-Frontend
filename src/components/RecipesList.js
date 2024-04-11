import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router";
import RecipeDataService from "../services/recipes";
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row' ;
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Heart from "react-heart";
import "./RecipesList.css";
import ".././App.css";


const RecipesList = ({
  user,
  saved,
  addsaved,
  deletesaved
}) => {
  // useState to set state values
  const [recipes, setRecipes] = useState([]);
  const [searchRecipeName, setSearchRecipeName] = useState("");
  // const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");

  var {category, type} = useParams();
  
  // useCallback to define functions which should
  // only be created once and will be dependencies for
  // useEffect


  const retrieveRecipes = useCallback(() => {
    setCurrentSearchMode("");
    //console.log(category == null)
    //console.log(category)
    //console.log(type)
    if(category !== null){
        findByFilter()
    }
    RecipeDataService.getAll(currentPage)
      .then(response => {
        setRecipes(response.data.recipes);
        setCurrentPage(response.data.page);
        setEntriesPerPage(response.data.entries_per_page);
      })
      .catch(e => {
        console.log(e);
      });
  }, [currentPage]);

  const find = useCallback((query, by) => {
    RecipeDataService.find(query, by, currentPage)
      .then(response => {
        console.log("here", response.data)
        setRecipes(response.data.recipes);
        console.log("here2", recipes)
      })
      .catch(e => {
        console.log(e);
      });
  }, [recipes]);

  const findByName = useCallback(() => {
    setCurrentSearchMode("findByName");
    find(searchRecipeName, "title");
  }, [find, searchRecipeName]);

  const findByFilter=useCallback(() =>{
    setCurrentSearchMode("findByFilter");
    find(type, category);
}, [find, type, category]);

  const retrieveNextPage = useCallback(() => {
    if (currentSearchMode === "findByName") {
      findByName();
    } 
    else if(currentSearchMode ==="findByFilter"){
        findByFilter();
    }
    else {
      retrieveRecipes();
    }
  }, [currentSearchMode, findByName, findByFilter, retrieveRecipes]);


  // Use effect to carry outside effect functionality
  useEffect(() => {
    setCurrentPage(0);
  }, [currentSearchMode]);

  // Retrieve the next page if currentPage value changes
  useEffect(() => {
    retrieveNextPage();
  }, [currentPage, retrieveNextPage]);


  // Other functions that are not depended on by useEffect
  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchRecipeName(searchName);
  }

  // Load default image when poster is not found
  const imgNotFound = e => {
    e.target.onerror = null;
    e.target.src = "../images/NoPosterAvailable-crop.jpeg"
  }

  return (
    <div className="App">
      <Container className="main-container">
        <Form>
          <Row>
            <Col>
            <Form.Group className="mb-3">
              <Form.Control
              type="text"
              placeholder="Search by name"
              value={searchRecipeName}
              onChange={onChangeSearchName}
              />
            </Form.Group>
            <Button
              variant="success"
              type="button"
              onClick={findByName}
            >
              Search
            </Button>
            </Col>
        </Row>
      </Form>
      <Row className="recipeRow">
        { recipes.map ((recipe) => {
          console.log("return", recipes)
          return(
            <Col key={recipe._id}>
              <Card className="recipeListCard">
              { user && (
                  saved.includes(recipe._id) ?
                  <Col>
			              <Heart className="heart" isActive={saved.includes(recipe._id)} onClick={() => {
                      deletesaved(recipe._id);
                  }}/>
                  </Col>
                  :
                  <Col>
                  <Heart className="heart" style={{stroke: "white"}} isActive={saved.includes(recipe._id)} onClick={() => {
                    addsaved(recipe._id);
                  }}/>
                  </Col>
              ) }
              <Card.Img
                className="smallPoster"
                src={recipe.picture}
                width={100}
                height={300}
                onError={imgNotFound}
                />
                <Card.Body className="cardBody">
                  <Card.Title> {recipe.recipe_name}</Card.Title>
                  <Card.Text className="inner" style={{maxHeight: 50}}>
                      {recipe.content}
                    ...
                  </Card.Text>
                  <Link to={"/recipes/"+recipe._id}>
                    View Full Recipe
                  </Link>
                </Card.Body>
                <Card.Footer className="text-muted">
                  #{recipe.meal} #{recipe.dietary} #{recipe.difficulty}
                </Card.Footer>
              </Card>
            </Col>
          )
        })}
      </Row>
      <br />
      Showing page: { currentPage + 1 }.
      <Button
        variant="link"
        onClick={() => { setCurrentPage(currentPage + 1)} }
        >
            Get next { entriesPerPage } results
        </Button>
      </Container>
    </div>
  )
}


export default RecipesList;