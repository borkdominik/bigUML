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
package com.eclipsesource.uml.glsp.core.gmodel.suffix;

import java.util.Map;
import java.util.Optional;

import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.features.id_generator.SuffixIdAppender;
import com.google.inject.Inject;

public class Suffix {
   @Inject
   protected Map<String, SuffixIdAppender> appenders;

   public String appendTo(final String suffix, final String id) {
      if (!appenders.containsKey(suffix)) {
         printContent();
         throw new GLSPServerException("Suffix " + suffix + " is not known. Did you register it?");
      }

      return appenders.get(suffix).appendTo(id);
   }

   public Optional<SuffixIdAppender> extractAppender(final String id) {
      return appenders.values().stream().filter(g -> g.isSuffixOf(id))
         .sorted((arg0, arg1) -> arg1.suffix().length() - arg0.suffix().length()).findFirst();
   }

   public Optional<String> extractSuffix(final String id) {
      return extractAppender(id).map(g -> g.suffix());
   }

   public Optional<String> extractId(final String id) {
      return extractAppender(id).map(g -> g.clear(id));
   }

   public boolean hasSuffix(final String id) {
      return extractAppender(id).isPresent();
   }

   public void printContent() {
      System.out.println("==== " + getClass().getName() + " ====");
      appenders.keySet().stream().sorted().forEach(key -> {
         System.out.println("Key:\t" + key);
         System.out.println("Value:\t" + appenders.get(key).getClass().getName());
         System.out.println();
      });
      System.out.println("==== END ====");
   }
}
