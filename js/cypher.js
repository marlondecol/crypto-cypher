/**
 * ✔ Fazer opção de agrupamento de caracteres
 * ✔ Tamanho do texto em caracteres
 * ✔ Contador de caracteres criptografados
 * ✔ Implementar a opção de download
 * ✔ Contador de bytes da mensagem cifrada
 * Página de ajuda
 * Informar os integrantes da equipe
 * Mostrar a tabela do alfabeto e grupos
 * Pop-up do que foi feito ao passar o mouse em um caractere
 * Comentar bem o código
 * Fazer uma documentação para a aplicação
 * Digitar o conteúdo do README.md
 */



// Alfabeto do método criptográfico.
var alphabet = "abcdefghijklmnopqrstuvwxyz";

// Grupos de substituição das letras do alfabeto.
var groups = [
	"8FHG3l1LEIwoMX6QPbV9aZSDjr",
	"z-kmxnBu0--OAv5p-Ryf4g----",
	"K-sNq---J--ac-2--TeYh-----",
	"7---t---------W--C--------",
	"i-------------d-----------"
];

// Variáveis do cronômetro.
var startTime, endTime;

// Tamanho dos agrupamentos.
var groupSize;

// Quantidade de caracteres criptografados.
var numEncrypted;

// Divide a mensagem criptografada em grupos de caracteres.
function agroup(msg, countTime=true) {
	if (countTime) startTime = new Date();

	msg = msg.replace(/\s/g,'');

	for (var pos = groupSize; pos < msg.length; pos += groupSize + 1) {
		msg = msg.slice(0, pos) + " " + msg.slice(pos);
	}

	if (countTime) endTime = new Date();

	return msg;
}

// Decripta uma mensagem.
function decrypt(msg, countTime=true) {
	if (countTime) startTime = new Date();

	var decrypted = "";

	for (var char of msg) {
		right = getRight(char);
		
		decrypted += right ? right : char;
	}

	if (countTime) endTime = new Date();

	return decrypted;
}

// Encripta uma mensagem.
function encrypt(msg, countTime=true) {
	numEncrypted = 0;

	if (countTime) startTime = new Date();

	msg = msg.toLowerCase();

	var encrypted = "";

	for (var char of msg) {
		if (alphabet.indexOf(char) < 0) {
			encrypted += char;
			continue;
		}

		encrypted += getRandom(char);
		numEncrypted++;
	}

	if (countTime) endTime = new Date();

	return encrypted;
}

// Seleciona um caractere aleatório do grupo pertencente ao caractere informado para criptografá-lo.
function getRandom(char) {
	var random = groups[Math.floor(Math.random() * groups.length)].charAt(alphabet.indexOf(char));

	return random == "-" ? getRandom(char) : random;
}

// Busca o caractere do alfabeto corresponde ao caractere informado, ou seja, revela o caractere correto.
function getRight(char) {
	for (var group of groups) {
		if (group.indexOf(char) >= 0) {
			return alphabet.charAt(group.indexOf(char));
		}
	}
}

// Baixa um arquivo .txt de uma das mensagens.
// Retirado de: https://thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip
function saveFile(input) {
	var date = new Date();
	
	date = date.getFullYear() + "-"
		 + date.getMonth() + "-"
		 + date.getDate() + "-"
		 + date.getHours() + "-"
		 + date.getMinutes() + "-"
		 + date.getSeconds() + "-"
		 + date.getMilliseconds();

	var link = document.createElement("a");

	link.download = input[0].id + "-" + date;
    link.href = window.URL.createObjectURL(new Blob([$(input).val()], {type:"text/plain"}));
    link.style.display = "none";
	
	document.body.appendChild(link);
 
	link.click();
	
	document.body.removeChild(link);
}

// Monta a estrutura e exibe o alfabeto e os grupos de letras na página de informações.
function showMethod() {
	for (var j = 0; j < alphabet.length; j++) {
		child = '<div class="set">';
		
		child += '<div class="alphabet">';
		child += '<div class="char">' + alphabet[j] + '</div>';
		child += '</div>';

		child += '<i class="arrow fas fa-arrow-down fa-fw"></i>';

		child += '<div class="group">';

		child += '<div class="char">' + groups[0][j] + '</div>';

		for (var i = 1; i < groups.length; i++) {
			if (groups[i][j] == "-") {
				break
			}

			child += '<div class="bull"></div>';
			child += '<div class="char">' + groups[i][j] + '</div>';
		}

		child += '</div>';

		child += '<div>';

		$("#alphabetTable").append(child);
	}
}

// Alterna a exibição do painel de informações.
function toggleHelp() {
	$(".page").toggleClass("hidden");
	$(".help").toggleClass("active");
}

// Alterna a exibição dos botões de opções em cada campo de texto, quando há ou não texto.
function toggleOptions(input) {
	if ($(input).val().length) {
		$(".buttons, .note, .param").removeClass("hidden");
	} else {
		$(".buttons, .note, .param").addClass("hidden");
	}
}

// Atualiza os contadores de caracteres e bytes.
function updateCounters() {
	$("#numBytes").text($("#encrypted").val().length);
	$("#numChars").text($("#decrypted").val().length);
	$("#numEncrypted").text(numEncrypted);
}

// Atualiza o cronômetro.
function updateTimer() {
	$("#timer").text(endTime - startTime + " ms");
}

// Ação da opção de limpar um campo de texto.
$(".option.clear").click(function() {
	var input = $(this).parent().parent().next();

	$("#groupSize").val(0).trigger("input");
	
	$(input).val("");
	$(input).trigger("input");
	$(input).focus();
});

// Ação da opção de copiar o texto de um campo.
$(".option.copy").click(function() {
	var input = $(this).parent().parent().next();
	
	$(input).select();

	document.execCommand("copy");
	window.getSelection().removeAllRanges();
	
	$(input).focus();
});

// Ação da opção de salvar um arquivo da mensagem de um campo.
$(".option.save").click(function() {
	saveFile($(this).parent().parent().next())
});

// Encripta um texto conforme digita uma mensagem e vai mostrando no campo oposto.
$("#decrypted").on("input", function() {
	$("#groupSize").val(0).trigger("input");
	$("#encrypted").val(encrypt($(this).val()));

	toggleOptions(this);
	updateCounters();
	updateTimer();
});

// Decifra uma mensagem criptografada conforme ela é informada e vai mostrando a mensagem revelada no outro campo.
$("#encrypted").on("input", function(ev) {
	$("#groupSize").val(0).trigger("input");
	$("#decrypted").val(decrypt($(this).val()));
	
	toggleOptions(this);
	updateCounters();
	updateTimer();
});

// Muda o agrupamento de caracteres ao digitar um valor.
$("#groupSize").on("input", function() {
	groupSizeVal = Math.floor($(this).val());
	
	if (groupSizeVal > 100) {
		groupSizeVal = 100;
		$(this).val(100);
	}
	
	if (groupSize == groupSizeVal) {
		return;
	}
	
	groupSize = groupSizeVal;
	
	$("#encrypted").val(groupSize > 0 ? agroup(encrypt($("#decrypted").val(), false)) : encrypt($("#decrypted").val()));
	$("#encrypted").prop("readonly", groupSize > 0);
	
	updateCounters();
	updateTimer();
});

// Ação ao clicar no botão de informações.
$("#help").click(toggleHelp);

// Ações realizadas ao carregar a página.
$(document).ready(function() {
	// Define o tamanho do agrupamento ao carregar a página,
	// usando o valor que estiver neste input.
	$("#groupSize").trigger("input");

	// Já atualiza todos os contadores.
	updateCounters();

	// Gera a tabela do alfabeto.
	showMethod();
});