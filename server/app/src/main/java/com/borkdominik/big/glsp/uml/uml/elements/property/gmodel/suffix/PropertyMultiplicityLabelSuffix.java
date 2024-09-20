/********************************************************************************
 * Copyright (c) 2022 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.property.gmodel.suffix;

import com.borkdominik.big.glsp.server.core.features.suffix.BGBaseSuffixIdAppender;

public final class PropertyMultiplicityLabelSuffix extends BGBaseSuffixIdAppender {
   public static final String SUFFIX = "_property_multiplicity_label";

   public PropertyMultiplicityLabelSuffix() {
      super(SUFFIX);
   }
}
