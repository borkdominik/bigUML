/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.package_merge.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.PackageMerge;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;

public class PackageMergeUtils {
   public static List<ElementReferencePropertyItem.Reference> asReferences(final List<PackageMerge> packageMerges,
      final EMFIdGenerator idGenerator) {
      var references = packageMerges.stream()
         .map(v -> {
            var label = String.format("<Package Merge> %s", v.getMergedPackage().getName());
            return new ElementReferencePropertyItem.Reference.Builder(idGenerator.getOrCreateId(v), label).name(
               v.getMergedPackage().getName()).build();
         })
         .collect(Collectors.toList());

      return references;
   }
}
