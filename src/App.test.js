import { render, screen } from '@testing-library/react';
import App from './App';
import data from './data.json';

describe('Star Wars App', () => {
  beforeAll(() => jest.spyOn(window, 'fetch'))

  //testing data local

/*   it('should show a list of characters including Luke Skywalker', () => {
    render(<App/>);
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
  });

  it('should show a list of characters from a JSON file', () => {
    render(<App/>);
    for(let character of data.results){
      expect(screen.getByText(character.name)).toBeInTheDocument();
    }
  }); */

  it('should show a list of characters from API key', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    });
    render(<App/>);
    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/');

    for(let character of data.results){
      expect(await screen.findByText(character.name)).toBeInTheDocument();
    }

  });

  it('should show an error message when has a network error', async () => {
    window.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<App/>);
    expect(await screen.findByText('Network error')).toBeInTheDocument();
  })
})