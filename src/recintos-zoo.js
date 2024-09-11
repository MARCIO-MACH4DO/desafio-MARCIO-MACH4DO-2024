const animais = {
  LEAO: { tamanho: 3, biomas: ['savana'] },
  LEOPARDO: { tamanho: 2, biomas: ['savana'] },
  CROCODILO: { tamanho: 3, biomas: ['rio'] },
  MACACO: { tamanho: 1, biomas: ['savana', 'floresta'] },
  GAZELA: { tamanho: 2, biomas: ['savana'] },
  HIPOPOTAMO: { tamanho: 4, biomas: ['savana e rio'] },
};

const recintos = [
  {
    numero: 1,
    bioma: 'savana',
    tamanhoTotal: 10,
    animais: ['MACACO', 'MACACO', 'MACACO'],
  },
  { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
  { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: ['GAZELA'] },
  { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
  { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: ['LEAO'] },
];

class RecintosZoo {
  constructor() {
    this.animais = animais;
    this.recintos = recintos;
  }

  // Verifica se o animal é válido
  animalValido(animal) {
    return Object.keys(this.animais).includes(animal);
  }

  // Verifica se a quantidade é válida
  quantidadeValida(quantidade) {
    return Number.isInteger(quantidade) && quantidade > 0;
  }

  // Verifica se o bioma é adequado para o animal
  biomaAdequado(animal, recinto) {
    return this.animais[animal].biomas.includes(recinto.bioma);
  }

  // Verifica se há espaço suficiente no recinto
  espacoSuficiente(animal, quantidade, recinto) {
    const espacoOcupado = recinto.animais.reduce(
      (total, animalNoRecinto) => total + this.animais[animalNoRecinto].tamanho,
      0,
    );
    const espacoNecessario =
      this.animais[animal].tamanho * quantidade +
      (recinto.animais.length > 0 ? 1 : 0);
    return recinto.tamanhoTotal - espacoOcupado >= espacoNecessario;
  }

  // Verifica se o animal é carnívoro
  carnivoro(animal) {
    return ['LEAO', 'LEOPARDO', 'CROCODILO'].includes(animal);
  }

  // Verifica se o recinto já possui outros animais e se o novo animal é compatível
  compativelComExistentes(animal, recinto) {
    if (recinto.animais.length === 0) {
      return true;
    }

    if (this.carnivoro(animal)) {
      return recinto.animais.every(
        (animalExistente) => animal === animalExistente,
      );
    }

    if (animal === 'HIPOPOTAMO') {
      return recinto.bioma === 'savana e rio';
    }

    if (animal === 'MACACO') {
      return recinto.animais.length > 0;
    }

    return true;
  }

  analisaRecintos(animal, quantidade) {
    if (!this.animalValido(animal)) {
      return { erro: 'Animal inválido' };
    }

    if (!this.quantidadeValida(quantidade)) {
      return { erro: 'Quantidade inválida' };
    }

    const recintosViaveis = this.recintos
      .filter(
        (recinto) =>
          this.biomaAdequado(animal, recinto) &&
          this.espacoSuficiente(animal, quantidade, recinto) &&
          this.compativelComExistentes(animal, recinto),
      )
      .map((recinto) => {
        const espacoOcupado = recinto.animais.reduce(
          (total, animalNoRecinto) =>
            total + this.animais[animalNoRecinto].tamanho,
          0,
        );
        const espacoLivre =
          recinto.tamanhoTotal -
          espacoOcupado -
          this.animais[animal].tamanho * quantidade -
          (recinto.animais.length > 0 &&
          !recinto.animais.every(
            (animalExistente) => animal === animalExistente,
          )
            ? 1
            : 0);
        return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
      });

    return recintosViaveis.length > 0
      ? { recintosViaveis }
      : { erro: 'Não há recinto viável' };
  }
}

// Exemplo de uso dentro do arquivo recintos-zoo.js
// Exemplo de chamada
const zoo = new RecintosZoo();
console.log(zoo.analisaRecintos('MACACO', 2)); // Teste para "MACACO"
console.log(zoo.analisaRecintos('UNICORNIO', 1)); // Teste para animal inválido

export { RecintosZoo as RecintosZoo };
