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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix;

import com.google.inject.Inject;

public class ClassSuffix {
   public final HeaderOuterSuffixAppender headerOuterSuffix;
   public final HeaderTypeSuffixAppender headerTypeSuffix;
   public final PropertySuffixAppender propertySuffix;
   public final PropertyIconSuffixAppender propertyIconSuffix;
   public final PropertyLabelNameSuffixAppender propertyLabelNameSuffix;
   public final PropertyLabelTypeSuffixAppender propertyLabelTypeSuffix;
   public final PropertyLabelMultiplicitySuffixAppender propertyLabelMultiplicitySuffix;

   @Inject
   public ClassSuffix(final HeaderOuterSuffixAppender headerOuterSuffix,
      final HeaderTypeSuffixAppender headerTypeSuffix,
      final PropertySuffixAppender propertySuffix, final PropertyIconSuffixAppender propertyIconSuffix,
      final PropertyLabelNameSuffixAppender propertyLabelNameSuffix,
      final PropertyLabelTypeSuffixAppender propertyLabelTypeSuffix,
      final PropertyLabelMultiplicitySuffixAppender propertyLabelMultiplicitySuffix) {
      super();
      this.headerOuterSuffix = headerOuterSuffix;
      this.headerTypeSuffix = headerTypeSuffix;
      this.propertySuffix = propertySuffix;
      this.propertyIconSuffix = propertyIconSuffix;
      this.propertyLabelNameSuffix = propertyLabelNameSuffix;
      this.propertyLabelTypeSuffix = propertyLabelTypeSuffix;
      this.propertyLabelMultiplicitySuffix = propertyLabelMultiplicitySuffix;
   }

}
