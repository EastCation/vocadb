﻿using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using VocaDb.Model.Service.Search;

namespace VocaDb.Tests.Service.Search {

	/// <summary>
	/// Tests for <see cref="SearchParser"/>.
	/// </summary>
	[TestClass]
	public class SearchParserTests {

		private void AssertSearchWord(SearchWordCollection result, string propName, params string[] values) {

			var words = result.TakeAll(propName);

			Assert.AreEqual(values.Length, words.Length, "Number of words matches");

			if (values.Length == 1 && words.Length == 1) {
				Assert.AreEqual(values.First(), words.First().Value);
			} else {

				foreach (var value in values) {
					Assert.IsTrue(words.Any(w => w.Value == value));
				}

			}


		}

		/// <summary>
		/// Query with keywords (in this case artist-name)
		/// </summary>
		[TestMethod]
		public void ParseQuery_QueryWithKeywords() {

			var result = SearchParser.ParseQuery("artist-name:doriko Nostalgia");

			AssertSearchWord(result, "artist-name", "doriko");
			AssertSearchWord(result, string.Empty, "Nostalgia");

		}

		[TestMethod]
		public void ParseQuery_KeywordWithPhrase() {

			var result = SearchParser.ParseQuery("artist-name:\"Hatsune Miku\" Nostalgia");

			AssertSearchWord(result, "artist-name", "Hatsune Miku");
			AssertSearchWord(result, string.Empty, "Nostalgia");

		}

		[TestMethod]
		public void ParseQuery_MultipleWords() {

			var result = SearchParser.ParseQuery("Romeo and Cinderella");

			AssertSearchWord(result, string.Empty, "Romeo", "and", "Cinderella");

		}

		[TestMethod]
		public void ParseQuery_QueryWithPhrase() {

			var result = SearchParser.ParseQuery("\"Romeo and Cinderella\"");

			AssertSearchWord(result, string.Empty, "Romeo and Cinderella");

		}

		[TestMethod]
		public void ParseQuery_WordsAndPhrase() {

			var result = SearchParser.ParseQuery("\"Romeo and Cinderella\" Hatsune Miku");

			AssertSearchWord(result, string.Empty, "Romeo and Cinderella", "Hatsune", "Miku");

		}

	}

}
