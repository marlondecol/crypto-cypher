/**
 * ✔ Fazer opção de agrupamento de caracteres
 * Contador de caracteres criptografados
 * Tamanho do texto em caracteres
 * Página de ajuda
 * Pop-up do que foi feito ao passar o mouse em um caractere
 * Implementar a opção de download
 * Rodapé com os integrantes da equipe
 * Fazer uma documentação para a aplicação
 * Digitar o conteúdo do README.md
 * Comentar bem o código
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
var startTime = 0;
var endTime = 0;

// Tamanho dos agrupamentos.
var groupSize;

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
	if (countTime) startTime = new Date();

	msg = msg.toLowerCase();

	var encrypted = "";

	for (var char of msg) {
		if (alphabet.indexOf(char) < 0) {
			encrypted += char;
			continue;
		}

		encrypted += getRandom(char);
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

// Alterna a exibição dos botões de opções em cada campo de texto, quando há ou não texto.
function toggleOptions(input) {
	if ($(input).val().length) {
		$(".buttons, .param").removeClass("hidden");
	} else {
		$(".buttons, .param").addClass("hidden");
	}
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

// Encripta um texto conforme digita uma mensagem e vai mostrando no campo oposto.
$("#decrypted").on("input", function() {
	$("#groupSize").val(0).trigger("input");
	$("#encrypted").val(encrypt($(this).val()));

	toggleOptions(this);
	updateTimer();
});

// Decifra uma mensagem criptografada conforme ela é informada e vai mostrando a mensagem revelada no outro campo.
$("#encrypted").on("input", function(ev) {
	$("#groupSize").val(0).trigger("input");
	$("#decrypted").val(decrypt($(this).val()));
	
	toggleOptions(this);
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
	
	updateTimer();
});

// Ações realizadas ao carregar a página.
$(document).ready(function() {
	// Define o tamanho do agrupamento ao carregar a página,
	// usando o valor que estiver neste input.
	$("#groupSize").trigger("input");
})