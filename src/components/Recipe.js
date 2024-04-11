import React, { useState, useEffect } from 'react';
import RecipeDataService from '../services/recipes';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import "./Recipe.css";
import ".././App.css";


const Recipe = ({ user }) => {
  let params = useParams () ;
    
  const [recipe, setRecipe] = useState({
    id: null,
    recipe_name: "",
    content: ""
  });
    
  useEffect(() => {
    const getRecipe = id => {
      RecipeDataService.getRecipe(id)
        .then(response => {
            setRecipe(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }
    getRecipe(params.id)
  }, [params.id]);

  // Load default image when poster is not found
  const imgNotFound = e => {
    e.target.onerror = null;
    e.target.src = "../images/NoPosterAvailable-crop.jpeg"
  }

  return (
    <div className = "App">
      <Container>
        <Row>
          <Col>
            <div className="image">
            <Image 
              className="bigPicture"
              src={recipe.picture}
              onError={imgNotFound}
              fluid />
            </div>
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">{recipe.recipe_name}</Card.Header>
              <Card.Body>
                <Card.Text>
                 {recipe.content}
                </Card.Text>
                <Card.Subtitle className="mb-2 text-muted">
                  #{recipe.meal} 
                  #{recipe.dietary} 
                  #{recipe.difficulty} 
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Recipe;