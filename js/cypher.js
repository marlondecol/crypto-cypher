/**
 * Variáveis globais.
 */

// Alfabeto do método criptográfico.
var alphabet = "abcdefghijklmnopqrstuvwxyz";

// Grupos de substituição dos caracteres do alfabeto.
var groups = [
	"8FHG3l1LEIwoMX6QPbV9aZSDjr",
	"z-kmxnBu0--OAv5p-Ryf4g----",
	"K-sNq---J--ac-2--TeYh-----",
	"7---t---------W--C--------",
	"i-------------d-----------"
];

// Tamanho dos agrupamentos.
var groupSize;

// Quantidade de caracteres criptografados.
var numEncrypted;

// Variáveis do cronômetro.
var startTime, endTime;

// Flag que é verdadeira apenas ao carregar a página.
var firstRun = true;



/**
 * Divide a mensagem criptografada em grupos de caracteres.
 * 
 * @param {string} msg Mensagem já criptografada.
 * @param {boolean} countTime Indica se o tempo deve ser contado.
 * 
 * @return {string} Mensagem agrupada por caracteres.
 */
function agroup(msg, countTime=true) {
	// Começa a contar o tempo.
	if (countTime) startTime = new Date();

	// Retira todos os espaços.
	msg = removeSpaces(msg, false);

	// Vai "fatiando" a mensagem usando como parâmetro de tamanho o que estiver definido na variável groupSize.
	// Note que no incremento é adicionado +1 além do groupSize porque o espaço já foi adicionado antes desta etapa.
	for (var pos = groupSize; pos < msg.length; pos += groupSize + 1) {
		msg = msg.slice(0, pos) + " " + msg.slice(pos);
	}

	// Termina de contar o tempo.
	if (countTime) endTime = new Date();
	
	return msg;
}



/**
 * Decripta uma mensagem.
 * 
 * @param {string} msg Mensagem criptografada a ser revelada.
 * @param {boolean} countTime Indica se o tempo deve ser contado.
 * 
 * @return {string} A mensagem revelada.
 */
function decrypt(msg, countTime=true) {
	// Começa a contar o tempo.
	if (countTime) startTime = new Date();

	var decrypted = "";

	// Para cada caractere da mensagem criptografada, ...
	for (var char of msg) {
		// ... obtém do alfabeto o caractere correspondente...
		right = getRight(char);
		
		// ... e adiciona à mensagem final revelada.
		decrypted += right ? right : char;
	}

	// Termina de contar o tempo.
	if (countTime) endTime = new Date();

	return decrypted;
}



/**
 * Encripta uma mensagem.
 * 
 * @param {string} msg Mensagem original a ser criptografada.
 * @param {boolean} countTime Indica se o tempo deve ser contado.
 * 
 * @return {string} A mensagem criptografada.
 */
function encrypt(msg, countTime=true) {
	numEncrypted = 0;

	// Começa a contar o tempo.
	if (countTime) startTime = new Date();

	// Como não há letras maiúsculas no alfabeto desta cifra, converte todas as letras da mensagem em minúsculas.
	msg = msg.toLowerCase();

	var encrypted = "";

	// Para cada caractere da mensagem original, ...
	for (var char of msg) {
		// ... verifica se ele está contido no alfabeto. Se não estiver, simplesmente o adiciona à mensagem final criptografada. ...
		if (alphabet.indexOf(char) < 0) {
			encrypted += char;
			continue;
		}

		// ... senão, adiciona um caractere aleatório do grupo correspondente...
		encrypted += getRandom(char);

		// ... e, somente neste caso, incrementa o número de caracteres cifrados.
		numEncrypted++;
	}

	// Termina de contar o tempo.
	if (countTime) endTime = new Date();

	return encrypted;
}



/**
 * Seleciona um caractere aleatório do grupo pertencente ao caractere informado para criptografá-lo.
 * 
 * @param {char} char Um caractere da mensagem original.
 * 
 * @return {char} Um caractere aleatório correspondente ao grupo do caractere informado.
 */
function getRandom(char) {
	// Obtém um caractere aleatório do grupo correspondente ao caractere do alfabeto que foi informado.
	// Isto significa que é escolhida uma das linhas da variável groups de forma aleatória,
	// mas o caractere desta linha deve estar na mesma posição que o caractere da variável char está no alfabeto.
	var random = groups[Math.floor(Math.random() * groups.length)].charAt(alphabet.indexOf(char));

	// Se este caractere aleatório não for um hífen, retorna-o. Senão, tenta novamente, quantas vezes forem necessárias.
	return random == "-" ? getRandom(char) : random;
}



/**
 * Busca o caractere do alfabeto corresponde ao caractere informado, ou seja, revela o caractere correto.
 * 
 * @param {char} char Um caractere da mensagem criptografada.
 * 
 * @return {char} O caractere do alfabeto correspondente ao grupo do caractere informado.
 */
function getRight(char) {
	// Para cada string da variável groups, ...
	for (var group of groups) {
		// ... faz uma busca pelo caractere da variável char.
		if (group.indexOf(char) > -1) {
			// Se encontrar, retorna o caractere do alfabeto da mesma posição que o da variável char.
			return alphabet.charAt(group.indexOf(char));
		}
	}
}



/**
 * Remove todos os espaços de uma mensagem.
 * 
 * @param {string} msg Mensagem para remover os espaços.
 * @param {boolean} countTime Indica se o tempo deve ser contado.
 * 
 * @return {string} A mensagem com os espaços removidos.
 */
function removeSpaces(msg, countTime=true) {
	// Começa a contar o tempo.
	if (countTime) startTime = new Date();

	// Remove os espaços.
	msg = msg.replace(/\s/g,'');

	// Termina de contar o tempo.
	if (countTime) endTime = new Date();

	return msg;
}



/**
 * Baixa um arquivo .txt de uma das mensagens.
 * 
 * Retirado de {@link https://thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip thiscouldbebetter}
 * 
 * @param {element} input Um dos campos de texto de mensagem do Crypto Cypher.
 */
function saveFile(input) {
	// Captura a data e hora atual para usá-la no nome do arquivo...
	var date = new Date();
	
	// ... e formata para uma string simples apenas com os números.
	date = date.getFullYear() + "-"
		 + date.getMonth() + "-"
		 + date.getDate() + "-"
		 + date.getHours() + "-"
		 + date.getMinutes() + "-"
		 + date.getSeconds() + "-"
		 + date.getMilliseconds();
	
	// Cria um elemento HTML para servir de link para o download...
	var link = document.createElement("a");
	// ... e deixa ele invisível.
	link.style.display = "none";
	
	// Define o nome do arquivo.
	link.download = input[0].id + "-" + date;

	// Monta um link com a criação de um objeto do tipo Blob que faz o download de um arquivo de texto.
    link.href = window.URL.createObjectURL(new Blob([$(input).val()], {type:"text/plain"}));
	
	// Por fim, adiciona o elemento no body da página, ...
	document.body.appendChild(link);

	// ... executa o clique no elemento para fazer o download...
	link.click();

	// ... e remove-o em seguida.
	document.body.removeChild(link);
}



/**
 * Monta a estrutura e exibe o alfabeto e os grupos de letras na página de informações.
 * 
 * Esta função foi feita para não ter que fazer toda a estrutura manualmente na página HTML,
 * e também porque já se ajusta automaticamente caso o alfabeto e seus grupos são alterados.
 */
function showMap() {
	// Para cada letra do alfabeto...
	for (var j = 0; j < alphabet.length; j++) {
		// ... cria uma "estrutura" que exibe ela juntamente com seu grupo de caracteres.
		child = '<div class="set">';
		
		// Exibe a letra do alfabeto.
		child += '<div class="alphabet">';
		child += '<div class="char">' + alphabet[j] + '</div>';
		child += '</div>';

		// Seta apontando para baixo, indicando os respectivos caracteres do grupo.
		child += '<i class="arrow fas fa-arrow-down fa-fw"></i>';

		// Cria a porção que mostra os caracteres do grupo.
		child += '<div class="group">';

		// Exibe o primeiro destes caracteres...
		child += '<div class="char">' + groups[0][j] + '</div>';

		// ... e os outros também, se existirem.
		for (var i = 1; i < groups.length; i++) {
			if (groups[i][j] == "-") {
				break
			}

			// Separador dos caracteres, para melhor visualização.
			child += '<div class="bull"></div>';

			child += '<div class="char">' + groups[i][j] + '</div>';
		}

		// Fecha a porção do grupo...
		child += '</div>';

		// ... e estrutura deste caractere do alfabeto.
		child += '<div>';

		// Finalmente, acrescenta toda a estrutura na página HTML.
		$("#alphabetTable").append(child);
	}
}



/**
 * Ativa ou desativa um elemento alternando a classe "active".
 * 
 * @param {element} input O elemento a alternar a ativação.
 */
function toggleActive(input) {
	$(input).toggleClass("active");
}



/**
 * Alterna a exibição do painel de informações.
 */
function toggleHelp() {
	toggleHidden(".page");
	toggleActive(".help");
}



/**
 * Exibe ou esconde um elemento alternando a classe "hidden".
 * 
 * @param {element} input O elemento a alternar a exibição.
 */
function toggleHidden(input) {
	$(input).toggleClass("hidden");
}



/**
 * Alterna a exibição dos botões de opções em cada campo de texto, quando há ou não texto.
 * 
 * @param {element} input Um dos campos de texto de mensagem do Crypto Cypher.
 */
function toggleOptions(input) {
	var elements = $(".buttons, .note, .params");
	
	$(input).val().length ?
		elements.removeClass("hidden") :
		elements.addClass("hidden");
}



/**
 * Atualiza os contadores de caracteres e bytes.
 */
function updateCounters() {
	$("#numBytes").text($("#encrypted").val().length);
	$("#numChars").text($("#decrypted").val().length);
	$("#numEncrypted").text(numEncrypted);
}



/**
 * Atualiza o cronômetro.
 */
function updateTimer() {
	// O tempo de um processo é a diferença entre o começo (startTime) e o término (endTime).
	// A medição é em milissegundos.
	$("#timer").text(endTime - startTime + " ms");
}



/**
 * Ação da opção de limpar um campo de texto.
 */
$(".option.clear").click(function() {
	// Define qual é o campo de mensagem respectivo ao botão pressionado.
	var input = $(this).parent().parent().next();

	// Zera o parâmetro de tamanho do agrupamento.
	$("#groupSize").val(0).trigger("input");

	// Desativa o botão de remover espaços.
	$("#toggleSpace").removeClass("active");
	
	$(input).val("");
	$(input).trigger("input");
	$(input).focus();
});



/**
 * Ação da opção de copiar o texto de um campo.
 */
$(".option.copy").click(function() {
	// Define qual é o campo de mensagem respectivo ao botão pressionado.
	var input = $(this).parent().parent().next();
	
	// Seleciona o texto do campo.
	$(input).select();

	// Executa o comando de copiar um texto selecionado.
	document.execCommand("copy");

	// Remove todas as seleções ativas na página.
	window.getSelection().removeAllRanges();
	
	$(input).focus();
});



/**
 * Ação da opção de salvar um arquivo da mensagem de um campo.
 */
$(".option.save").click(function() {
	// O parâmetro corresponde ao campo de mensagem respectivo ao botão pressionado.
	saveFile($(this).parent().parent().next())
});



/**
 * Encripta um texto conforme digita uma mensagem e vai mostrando no campo oposto.
 */
$("#decrypted").on("input", function() {
	// Zera o parâmetro de tamanho do agrupamento...
	$("#groupSize").val(0).trigger("input");

	// Desativa o botão de remover espaços.
	$("#toggleSpace").removeClass("active");

	// Exibe o resultado da encriptação.
	$("#encrypted").val(encrypt($(this).val()));

	// Alterna a exibição das opções e configurações.
	toggleOptions(this);

	// Atualiza os contadores de caracteres e bytes.
	updateCounters();

	// Atualiza o cronômetro.
	updateTimer();
});



/**
 * Decifra uma mensagem criptografada conforme ela é informada e vai mostrando a mensagem revelada no outro campo.
 */
$("#encrypted").on("input", function(ev) {
	// Zera o parâmetro de tamanho do agrupamento.
	$("#groupSize").val(0).trigger("input");
	
	// Exibe o resultado da decriptação.
	$("#decrypted").val(decrypt($(this).val()));
	
	// Alterna a exibição das opções e configurações.
	toggleOptions(this);

	// Atualiza os contadores de caracteres e bytes.
	updateCounters();

	// Atualiza o cronômetro.
	updateTimer();
});



/**
 * Alterna a remoção de espaço da mensagem criptografada.
 */
$("#toggleSpace").click(function() {
	// Alterna a ativação do botão.
	toggleActive(this);

	// A mensagem cifrada não pode permitir modificação se os espaços estiverem removidos ou se o agrupamento estiver ativado.
	$("#encrypted").prop("readonly", groupSize > 0 || $(this).hasClass("active"));
	
	// Define o texto da mensagem cifrada...
	$("#encrypted").val(
		// ... de acordo com o estado do botão.
		$(this).hasClass("active") ?
			// Se estiver pressionado, remove os espaços.
			removeSpaces(encrypt($("#decrypted").val(), false)) :
			// Senão, se um tamanho de agrupamento já estiver definido, ...
			groupSize > 0 ?
				// ... faz o agrupamento...
				agroup(encrypt($("#decrypted").val(), false)) :
				// ... ou, caso contrário, simplemente criptografa a mensagem original.
				encrypt($("#decrypted").val())
	);

	// Atualiza os contadores de caracteres e bytes.
	updateCounters();

	// Atualiza o cronômetro.
	updateTimer();
});



/**
 * Muda o agrupamento de caracteres ao digitar um valor.
 */
$("#groupSize").on("input", function() {
	// Desativa o botão de remover espaços.
	$("#toggleSpace").removeClass("active");

	// Como o input permite inserir números fracionários, é necessário obter o inteiro deste número.
	groupSizeVal = Math.floor($(this).val());
	
	// Não permite números menores que 0 ou maiores que 100.
	if (groupSizeVal < 0) {
		groupSizeVal = 0;
		$(this).val(0);
	} else if (groupSizeVal > 100) {
		groupSizeVal = 100;
		$(this).val(100);
	}
	
	// Se o número for o mesmo que o anterior, não continua o processo para não consumir processamento.
	if (groupSize == groupSizeVal) {
		return;
	}
	
	// Define a variável global como sendo o valor do input.
	groupSize = groupSizeVal;

	// Quando estiver exibindo os agrupamentos, não permite modificar o texto da mensagem cifrada.
	$("#encrypted").prop("readonly", groupSize > 0);
	
	// Se o valor for diferente de 0, faz os agrupamentos, senão mantém as características da mensagem original.
	$("#encrypted").val(
		groupSize > 0 ?
			agroup(encrypt($("#decrypted").val(), false)) :
			encrypt($("#decrypted").val())
	);

	// Atualiza os contadores de caracteres e bytes.
	updateCounters();

	// Como esta função é executada uma vez assim que a página é carregada, não pode ser feita a atualização do cronômetro nesta
	// primeira vez para não substituir o símbolo de infinito, que indica que nenhuma operação foi realizada ainda.
	firstRun ? firstRun = false : updateTimer();
});



/**
 * Ação ao clicar no botão de informações.
 */
$("#help").click(toggleHelp);



/**
 * Ações realizadas ao carregar a página.
 */
$(document).ready(function() {
	// Define o tamanho do agrupamento ao carregar a página,
	// usando o valor que estiver neste input.
	$("#groupSize").trigger("input");

	// Atualiza todos os contadores.
	updateCounters();

	// Gera a tabela do alfabeto.
	showMap();
});