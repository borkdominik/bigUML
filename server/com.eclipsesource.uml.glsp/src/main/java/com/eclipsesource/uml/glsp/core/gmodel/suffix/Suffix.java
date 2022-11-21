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

import com.google.inject.Inject;

public class Suffix {
   public final HeaderSuffixAppender headerSuffix;
   public final HeaderLabelSuffixAppender headerLabelSuffix;
   public final HeaderIconSuffixAppender headerIconSuffix;
   public final CompartmentSuffixAppender compartmentSuffix;
   public final LabelSuffixAppender labelSuffix;

   @Inject
   public Suffix(final HeaderSuffixAppender headerSuffix,
      final HeaderLabelSuffixAppender headerLabelSuffix, final HeaderIconSuffixAppender headerIconSuffix,
      final CompartmentSuffixAppender compartmentSuffix, final LabelSuffixAppender labelSuffix) {

      this.headerSuffix = headerSuffix;
      this.headerLabelSuffix = headerLabelSuffix;
      this.headerIconSuffix = headerIconSuffix;
      this.compartmentSuffix = compartmentSuffix;
      this.labelSuffix = labelSuffix;
   }

}
