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

// Decripta uma mensagem.
function decrypt(msg) {
	startTime = new Date();

	var decrypted = "";

	for (var char of msg) {
		right = getRight(char);
		
		decrypted += right ? right : char;
	}

	endTime = new Date();

	return decrypted;
}

// Encripta uma mensagem.
function encrypt(msg) {
	startTime = new Date();

	msg = msg.toLowerCase();

	var encrypted = "";

	for (var char of msg) {
		if (alphabet.indexOf(char) < 0) {
			encrypted += char;
			continue;
		}

		encrypted += getRandom(char);
	}

	endTime = new Date();

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
function toggleButtons(input) {
	if ($(input).val().length) {
		$(".option").css({
			"opacity": "1",
			"visibility": "visible",
		});
	} else {
		$(".option").css({
			"opacity": "0",
			"visibility": "hidden",
		});
	}
}

// Atualiza o cronômetro.
function updateTimer() {
	$("#timer").text(endTime - startTime + " ms");
}

// Se clica em qualquer região ao redor dos campos de texto, seleciona o campo correspondente.
$(".box").click(function() {
	$(this).find(".input").focus();
});

// Ação da opção de limpar um campo de texto.
$(".option.clear").click(function() {
	var input = $(this).parent().parent().next();
	
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
	$("#encrypted").val(encrypt($(this).val()));
	toggleButtons(this);
	updateTimer();
});

// Decifra uma mensagem criptografada conforme ela é informada e vai mostrando a mensagem revelada no outro campo.
$("#encrypted").on("input", function() {
	$("#decrypted").val(decrypt($(this).val()));
	toggleButtons(this);
	updateTimer();
});