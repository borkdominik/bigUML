/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.features.idgenerator;

import java.util.Optional;
import java.util.Set;

import com.google.inject.Inject;

public class SuffixIdExtractor {

   @Inject
   private Set<SuffixIdAppender> generators;

   public Optional<SuffixIdAppender> extractGenerator(final String id) {
      return generators.stream().filter(g -> g.isSuffixOf(id))
         .sorted((arg0, arg1) -> arg1.suffix().length() - arg0.suffix().length()).findFirst();
   }

   public Optional<String> extractSuffix(final String id) {
      return extractGenerator(id).map(g -> g.suffix());
   }

   public Optional<String> extractId(final String id) {
      return extractGenerator(id).map(g -> g.clear(id));
   }

   public boolean hasSuffix(final String id) {
      return extractGenerator(id).isPresent();
   }

}
